const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id_usuario, email: user.email, perfil: user.perfil_id_perfil },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

module.exports = generateToken;
