const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token não fornecido.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido.' });
        req.user = user;
        next();
    });
};

const authorizePerfil = (allowedProfiles) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: 'Não autenticado.' });
        if (!allowedProfiles.includes(req.user.perfil)) {
            return res.status(403).json({ message: 'Acesso negado.' });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizePerfil,
};
