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
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Utilizador não autenticado.' });
        }

        try {
            // --- CORREÇÃO CRÍTICA ---
            // A consulta agora usa os aliases corretos ('Perfil' e 'Permissoes')
            // para corresponder às definições dos modelos.
            const usuario = await Usuario.findByPk(userId, {
                include: [{
                    model: Perfil,
                    as: 'Perfil',
                    include: [{
                        model: Permissao,
                        as: 'Permissoes',
                        through: { attributes: [] }
                    }]
                }]
            });

            if (!usuario || !usuario.Perfil || !usuario.Perfil.Permissoes) {
                return res.status(403).json({ message: 'Acesso negado. Perfil ou permissões não encontrados.' });
            }

            const permissoesDoUsuario = usuario.Perfil.Permissoes.map(p => p.nome);

            if (permissoesDoUsuario.includes(permissaoNecessaria)) {
                return next();
            } else {
                return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
            }

        } catch (error) {
            console.error("Erro no middleware de permissão:", error);
            return res.status(500).json({ message: 'Erro interno ao verificar permissões.', error: error.message });
        }
    };
};

module.exports = {
    pode
};
