/**
 * Este código contém os middlewares responsáveis pela autenticação e autorização
 * de rotas na aplicação.
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar a validade de um token JWT enviado no cabeçalho 'Authorization'.
 * Se o token for válido, adiciona os dados do utilizador decodificados ao objeto `req`
 * e passa para a próxima função na cadeia de middlewares.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    //Verifica a assinatura e a validade do token
    jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta_padrao', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido ou expirado.' });
        }
        req.user = user;
        next();
    });
};

/**
 * Uma função de "fábrica" que retorna um middleware de autorização.
 * O middleware gerado verifica se o perfil do utilizador logado está
 * incluído na lista de perfis permitidos.
 */
const authorizePerfil = (allowedProfiles) => {
    return (req, res, next) => {
        // Verifica se o middleware 'authenticateToken' foi executado antes e anexou o utilizador
        if (!req.user || !req.user.perfil) {
            return res.status(401).json({ message: 'Não autenticado ou o perfil do utilizador não foi encontrado no token.' });
        }

        // Verifica se o perfil do utilizador está na lista de perfis permitidos
        if (!allowedProfiles.includes(req.user.perfil)) {
            return res.status(403).json({ message: 'Acesso negado. O seu perfil não tem permissão para esta ação.' });
        }
        next();
    };
};

module.exports = {
    authenticateToken,
    authorizePerfil,
};
