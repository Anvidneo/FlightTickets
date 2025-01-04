const bcrypt = require('bcrypt');
const { login } = require('../controllers/authController');
const { AppDataSource } = require('../config/data-source');
const { _response } = require('../utils/helpers');
const { _createToken } = require('../utils/jwt');

jest.mock('../config/data-source', () => ({
    AppDataSource: {
        getRepository: jest.fn(),
    },
}));

jest.mock('../utils/helpers', () => ({
    _log: jest.fn(),
    _response: jest.fn(),
}));

jest.mock('../utils/jwt.js', () => ({
    _createToken: jest.fn(),
}));

jest.mock('bcrypt');

describe('login', () => {
    let mockReq, mockRes, mockRepository;
    const mockUser = {
        "username": "user",
        "password": "cyfmyz-gogmeQ-fegxo8"
    };

    beforeEach(() => {
        mockRepository = {
            findOne: jest.fn(),
        };

        AppDataSource.getRepository.mockReturnValue(mockRepository);

        mockReq = {
            body: mockUser,
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        _response.mockImplementation((status, message, data) => ({ status, message, data }));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should login successfully and return 201', async () => {
        _createToken.mockReturnValue({ username: mockReq.body.username });
        mockRepository.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        _createToken.mockReturnValue('$2b$10$AAYb29Vgo0kmgBiGroMfrur2P25Bjo3c0flxzO.PA9rh3NNNPiTa.')

        await login(mockReq, mockRes);

        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { username: mockReq.body.username } });
        expect(bcrypt.compare).toHaveBeenCalledWith(mockReq.body.password, mockReq.body.password);
        expect(_createToken).toHaveBeenCalledWith({ username: mockReq.body.username });
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 201,
            message: 'Token generated correctly',
            data: '$2b$10$AAYb29Vgo0kmgBiGroMfrur2P25Bjo3c0flxzO.PA9rh3NNNPiTa.',
        });
    });

    it('should return 404 if user not found', async () => {
        mockReq.body.username = "user1";

        await login(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 404,
            message: 'User not found',
            data: undefined
        });
    });

    it('should return 401 if password does not match', async () => {
        mockRepository.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);
        _response.mockReturnValue({
            status: 401,
            message: 'Credenciales inválidas'
        });

        await login(mockReq, mockRes);

        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { username: mockReq.body.username } });
        expect(bcrypt.compare).toHaveBeenCalledWith(mockReq.body.password, mockReq.body.password);
        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 401,
            message: 'Credenciales inválidas'
        });
    });

    it('should return 500 if there is a repository error', async () => {
        mockRepository.findOne.mockResolvedValue({ where: { username: mockReq.body.username } });
        bcrypt.compare.mockRejectedValue(new Error('Bcrypt error'));

        await login(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({
            status: 500,
            message: 'Authenticate error',
        });
    });
});
