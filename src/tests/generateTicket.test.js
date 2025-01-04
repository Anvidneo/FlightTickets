const { generateTicket } = require('../controllers/ticketController');
const { AppDataSource } = require("../config/data-source");
const { _response } = require('../utils/helpers');
const PDFDocument = require('pdfkit');

jest.mock('../config/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));

jest.mock('../utils/helpers', () => ({
    _response: jest.fn(),
}));

describe('generateTicket', () => {
    let mockReq, mockRes, mockRepository;
    const mockTicket = {
        flightId: 2,
        airline: "Avianca",
        datetime: "2025-01-03 13:22:45",
        clientId: 2
    };

    beforeEach(() => {
        mockRepository = {
            findOne: jest.fn(),
        };

        AppDataSource.getRepository.mockReturnValue(mockRepository);

        mockReq = {
            body: mockTicket,
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            writeHead: jest.fn(),
        };

        _response.mockImplementation((status, message, data) => ({ status, message, data }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 200 and generate a PDF ticket successfully', async () => {
        const mockClient = {
            id: 2,
            name: 'Juan D Botero C',
        };
    
        const mockFlight = {
            id: 2,
            origin: 'Rionegro',
            destination: 'Miami',
            seat: '1',
        };
    
        mockRepository.findOne
            .mockResolvedValueOnce(mockFlight)
            .mockResolvedValueOnce(mockClient);
    
        const mockWriteHead = jest.fn();
        mockRes.writeHead = mockWriteHead;
    
        await generateTicket(mockReq, mockRes);
    
        expect(mockRepository.findOne).toHaveBeenNthCalledWith(1, { where: { id: mockTicket.flightId } });
        expect(mockRepository.findOne).toHaveBeenNthCalledWith(2, { where: { id: mockTicket.clientId } });
        expect(mockRes.writeHead).toHaveBeenCalledWith(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${mockTicket.clientId}.pdf`,
        });
    });
    
    it('should return 404 if flight not found', async () => {
        mockRepository.findOne.mockResolvedValueOnce(null);

        await generateTicket(mockReq, mockRes);

        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: mockTicket.flightId } });
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 404,
            message: 'Flight not found',
            data: undefined
        });
    });

    it('should return 404 if client not found', async () => {
        mockRepository.findOne.mockResolvedValueOnce({
            id: 2,
            origin: 'Rionegro',
            destination: 'Miami',
            seat: '1',
        });

        mockRepository.findOne.mockResolvedValueOnce(null);

        await generateTicket(mockReq, mockRes);

        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: mockTicket.clientId } });
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 404,
            message: 'Client not found',
            data: undefined
        });
    });

    it('should return 500 if there is a repository error', async () => {
        mockRepository.findOne.mockRejectedValue(new Error('Database error'));

        await generateTicket(mockReq, mockRes);

        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: mockTicket.flightId } });
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 500,
            message: 'Error generating ticket',
            data: undefined,
        });
    });

    it('should return 500 if PDF generation fails', async () => {
        const mockDoc = new PDFDocument();
        mockDoc.end(() => {
            throw new Error('PDF generation error');
        });

        mockRepository.findOne.mockResolvedValueOnce({
            id: 2,
            origin: 'Rionegro',
            destination: 'Miami',
            seat: '1',
        });

        mockRepository.findOne.mockResolvedValueOnce({
            id: 2,
            name: 'Juan D Botero C',
        });

        await generateTicket(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 500,
            message: 'Error generating ticket',
            data: undefined,
        });
    });
});