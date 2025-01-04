const { AppDataSource } = require("../config/data-source");
const { _response } = require('../utils/helpers');
const { _createToken } = require('../utils/jwt');
const User = require("../models/User");
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { username, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const userSaved = await userRepository.findOne({ where: { username: username } });
    
    if (!userSaved) {
        return res.status(404).json(_response(404, 'User not found'));
    }

    try {
        const passwordMatch = await bcrypt.compare(password, userSaved.password);
        
        if (!passwordMatch) {
            return res.status(401).json(_response(401, 'Invalid credentials'));
        }

        const token = _createToken({ username: userSaved.username });
        const response = _response(201, 'Token generated correctly', token);

        res.status(201).json(response);
    } catch (error) {
        console.error("Error comparing password:", error);
        return res.status(500).json(_response(500, 'Authenticate error'));
    }
};

module.exports = { login };