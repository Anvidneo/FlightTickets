const jwt = require('jsonwebtoken');
const secret = secrets.JWT_SECRET;

function _createToken(payload) {
    return jwt.sign(payload, secret, { expiresIn: '1h' });
}

function _validateToken(token) {
    return jwt.verify(token, secret);
}

module.exports = { _createToken, _validateToken };