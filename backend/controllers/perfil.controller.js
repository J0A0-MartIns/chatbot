/**
 * Gerencia o CRUD de Perfis e suas associações com Permissões.
 */

const { Perfil, Permissao } = require('../models');

const PerfilController = {

    /**
     * @description Busca um único perfil pelo seu ID.
     * @route GET /perfis/:id
     */
    async getPerfilById(req, res) {
        const { id } = req.params;
        try {
            const perfil = await Perfil.findByPk(id);
            if (!perfil) {
                return res.status(404).json({ message: 'Perfil não encontrado.' });
            }
            return res.status(200).json(perfil);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar perfil.', error: err.message });
        }
    },

    /**
     * @description Lista todos os perfis, incluindo suas permissões associadas.
     */
    async listarPerfis(req, res) {
        try {
            const perfis = await Perfil.findAll({
                include: [{ model: Permissao, as: 'Permissaos', through: { attributes: [] } }],
                order: [['nome', 'ASC']]
            });
            return res.status(200).json(perfis);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao listar perfis.', error: err.message });
        }
    },

    /**
     * @description Cria um novo perfil e associa as permissões enviadas.
     */
    async criarPerfil(req, res) {
        const { nome, permissoes } = req.body;

        if (!nome) {
            return res.status(400).json({ message: 'O nome do perfil é obrigatório.' });
        }

        try {
            const novoPerfil = await Perfil.create({ nome });
            if (permissoes && permissoes.length > 0) {
                await novoPerfil.setPermissaos(permissoes);
            }
            return res.status(201).json(novoPerfil);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao criar perfil.', error: err.message });
        }
    },

    /**
     * @description Atualiza um perfil existente e suas permissões.
     */
    async updatePerfil(req, res) {
        const { id } = req.params;
        const { nome, permissoes } = req.body;

        try {
            const perfil = await Perfil.findByPk(id);
            if (!perfil) {
                return res.status(404).json({ message: 'Perfil não encontrado.' });
            }

            perfil.nome = nome;
            await perfil.save();

            //Sincroniza as permissões do perfil com a lista enviada.
            //Sequelize vai remover as antigas e adicionar as novas automaticamente.
            if (permissoes) {
                await perfil.setPermissaos(permissoes);
            }

            return res.status(200).json(perfil);

        } catch (err) {
            return res.status(500).json({ message: 'Erro ao atualizar perfil.', error: err.message });
        }
    },

    /**
     * @description Deleta um perfil.
     * @route DELETE /perfis/:id
     */
    async deletePerfil(req, res) {
        const { id } = req.params;
        try {
            const perfil = await Perfil.findByPk(id);
            if (!perfil) {
                return res.status(404).json({ message: 'Perfil não encontrado.' });
            }
            await perfil.destroy();
            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao deletar perfil.', error: err.message });
        }
    }
};

module.exports = PerfilController;


