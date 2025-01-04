function _response(status, message, data = null) {
    return {
        status,
        message,
        data,
        timestamp: new Date()
    };
}

const _hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

module.exports = { _response, _hashPassword }