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
                include: [{ model: Permissao, as: 'Permissoes', through: { attributes: [] } }],
                order: [['nome', 'ASC']]
            });
            return res.status(200).json(perfis);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao listar perfis.', error: err.message });
        }
    },

    /**
     * @description Cria um novo perfil e associa as permissões de forma atómica.
     */
    async criarPerfil(req, res) {
        const { nome, permissoes } = req.body;
        if (!nome) {
            return res.status(400).json({ message: 'O nome do perfil é obrigatório.' });
        }

        // Inicia uma transação
        const t = await sequelize.transaction();
        try {
            const novoPerfil = await Perfil.create({ nome }, { transaction: t });

            if (permissoes && Array.isArray(permissoes) && permissoes.length > 0) {
                await novoPerfil.setPermissoes(permissoes, { transaction: t });
            }

            // Se tudo correu bem, confirma a transação
            await t.commit();
            return res.status(201).json(novoPerfil);

        } catch (err) {
            // Se algo deu errado, desfaz todas as operações
            await t.rollback();
            console.error("Erro ao criar perfil:", err);
            return res.status(500).json({ message: 'Erro ao criar perfil.', error: err.message });
        }
    },

    /**
     * @description Atualiza um perfil existente e suas permissões de forma atómica.
     */
    async updatePerfil(req, res) {
        const { id } = req.params;
        const { nome, permissoes } = req.body;

        const t = await sequelize.transaction();
        try {
            const perfil = await Perfil.findByPk(id, { transaction: t });
            if (!perfil) {
                await t.rollback();
                return res.status(404).json({ message: 'Perfil não encontrado.' });
            }

            perfil.nome = nome;
            await perfil.save({ transaction: t });

            if (permissoes) {
                await perfil.setPermissoes(permissoes, { transaction: t });
            }

            await t.commit();
            return res.status(200).json(perfil);

        } catch (err) {
            await t.rollback();
            console.error("Erro ao atualizar perfil:", err);
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


