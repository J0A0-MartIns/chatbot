/**
 * Contém os middlewares responsáveis pela autenticação e autorização de rotas na aplicação.
 */

const jwt = require('jsonwebtoken');
const { SessaoUsuario } = require('../models');

/**
 * Middleware para verificar a validade de um token JWT enviado no cabeçalho 'Authorization'.
 * Se o token for válido, adiciona os dados do usuário decodificados ao objeto `req`
 * e passa para a próxima função na cadeia de middlewares.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    //Verifica a assinatura e a validade do token
    jwt.verify(token, process.env.JWT_SECRET || 'chave_secreta_padrao', async (err, user) => {

        if (err) {
            return res.status(403).json({message: 'Token inválido ou expirado.'});
        }

        try {
            const sessaoAtiva = await SessaoUsuario.findOne({
                where: {
                    id_usuario: user.id,
                    token: token,
                    data_logout: null
                }
            });

            if (!sessaoAtiva) {
                return res.status(401).json({message: 'Sessão inválida ou expirada. Por favor, faça login novamente.'});
            }
            req.user = user;
            next();

        } catch (dbError) {
            console.error("Erro ao validar sessão no banco de dados:", dbError);
            return res.status(500).json({message: 'Erro de servidor ao validar a sessão.'});
        }
    });
};

module.exports = {
    authenticateToken
};
