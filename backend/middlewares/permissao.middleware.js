/**
 * Este middleware controla o RBAC (Role-Based Access Control).
 * Ele verifica se o perfil do usuário logado possui a permissão específica.
 */

const { Usuario, Perfil, Permissao } = require('../models');

const pode = (permissaoNecessaria) => {
    return async (req, res, next) => {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Utilizador não autenticado.' });
        }

        try {
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
