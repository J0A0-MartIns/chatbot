/**
 * Fornece a lista de todas as permissões disponíveis no sistema.
 */

const { Permissao } = require('../models');

const PermissaoController = {
    /**
     * @description Lista todas as permissões cadastradas.
     * @route GET /permissoes
     */
    async listarTodas(req, res) {
        try {
            const permissoes = await Permissao.findAll({ order: [['nome', 'ASC']] });
            return res.status(200).json(permissoes);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao listar permissões.', error: err.message });
        }
    }
};

module.exports = PermissaoController;
