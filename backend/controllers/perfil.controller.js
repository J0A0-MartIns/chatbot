/**
 * Gerencia o CRUD de Perfis e suas associações com Permissões.
 */

const { Perfil, sequelize  } = require('../models');

const PerfilController = {

    /**
     * Lista todos os perfis
     */
    async listarPerfis(req, res) {
        try {
            const perfis = await Perfil.findAll({
                order: [['nome', 'ASC']]
            });
            return res.status(200).json(perfis);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao listar perfis.', error: err.message });
        }
    },
};

module.exports = PerfilController;


