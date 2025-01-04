const { generateTicket } = require('../controllers/ticketController');
const { AppDataSource } = require("../config/data-source");
const { _response } = require('../utils/helpers');
const PDFDocument = require('pdfkit');
const path = require('path');

jest.mock('../config/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));

jest.mock('../utils/helpers', () => ({
    _response: jest.fn(),
}));

jest.mock('pdfkit', () => {
    const mockDoc = {
        image: jest.fn(),
        font: jest.fn(),
        fontSize: jest.fn(),
        text: jest.fn(),
        pipe: jest.fn(),
        end: jest.fn(),
        openImage: jest.fn(() => ({ width: 100, height: 50 })),
    };

    const mockPDFDocument = jest.fn(() => mockDoc);
    mockPDFDocument.mockDoc = mockDoc;
    return mockPDFDocument;
});

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
        const mockDoc = PDFDocument.mockDoc;
        mockDoc.end.mockImplementation(() => {
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