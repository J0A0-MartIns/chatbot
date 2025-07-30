
/**
 * Middleware para verificar se o usuário tem o papel de Administrador.
 * Ele lê o perfil diretamente do token JWT.
 */
const isAdmin = (req, res, next) => {
    const userProfile = req.user?.perfil;

    if (userProfile && userProfile === 'Administrador') {
        return next();
    }
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores podem executar esta ação.' });
};

module.exports = {
    isAdmin
};