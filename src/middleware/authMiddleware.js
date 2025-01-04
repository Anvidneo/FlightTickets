const { _validateToken } = require('../utils/jwt');

function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. Token not found.' });
    }

    try {
        const payload = _validateToken(token);
        req.user = payload;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Expired or invalid token.' });
    }
}

module.exports = authenticateToken;