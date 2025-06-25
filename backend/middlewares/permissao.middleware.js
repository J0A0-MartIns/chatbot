/**
 * Este middleware é o coração do sistema RBAC (Role-Based Access Control).
 * Ele verifica se o perfil do usuário logado possui uma permissão específica.
 */

const { Usuario, Perfil, Permissao } = require('../models');

/**
 * Função de alta ordem que gera um middleware de verificação de permissão.
 * @param {string} permissaoNecessaria - O nome da permissão necessária para acessar a rota (ex: 'deletar_documento').
 * @returns {function} Uma função de middleware para o Express.
 */
const pode = (permissaoNecessaria) => {
    return async (req, res, next) => {
        //O ID do usuário DEVE ter sido adicionado à requisição pelo middleware 'authenticateToken'
        const userId = req.user.id;

        if (!userId) {
            return res.status(401).json({ message: 'Usuário não autenticado.' });
        }

        try {
            // Busca o usuário, seu perfil e TODAS as permissões associadas a esse perfil.
            const usuario = await Usuario.findByPk(userId, {
                include: {
                    model: Perfil,
                    include: {
                        model: Permissao,
                    }
                }
            });

            if (!usuario || !usuario.Perfil || !usuario.Perfil.Permissoes) {
                return res.status(403).json({ message: 'Acesso negado. Perfil ou permissões não encontrados.' });
            }

            const permissoesDoUsuario = usuario.Perfil.Permissoes.map(p => p.nome);

            // Verifica se a permissão necessária está na lista de permissões do usuário.
            if (permissoesDoUsuario.includes(permissaoNecessaria)) {
                //Se o usuário tem a permissão, continua para a próxima função (o controller).
                return next();
            } else {
                // Se não tem a permissão, retorna um erro de 'Acesso Proibido'.
                return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
            }

        } catch (error) {
            return res.status(500).json({ message: 'Erro interno ao verificar permissões.', error: error.message });
        }
    };
};

module.exports = {
    pode
};
