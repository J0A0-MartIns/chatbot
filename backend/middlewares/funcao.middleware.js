//function permitirPerfil(...perfisPermitidos) {
//    return (req, res, next) => {
//        const perfil = req.usuario?.perfil;
//
//        if (!perfil || !perfisPermitidos.includes(perfil)) {
//            return res.status(403).json({ message: 'Acesso negado' });
//        }
//        next();
//    };
//}
//
//module.exports = permitirPerfil;
