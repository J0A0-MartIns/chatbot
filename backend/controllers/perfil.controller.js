/**
 * controllers/perfil.controller.js
 *
 * Este arquivo gerencia a lógica de negócio para as operações de CRUD (Criar, Ler, Atualizar, Deletar)
 * relacionadas aos perfis de usuário.
 */

// Importa o modelo Perfil. Assumi que o nome do modelo definido no Sequelize é 'Perfil'.
const { Perfil } = require('../models');

const PerfilController = {
    /**
     * @description Lista todos os perfis cadastrados.
     * @route GET /perfis
     */
    async listarPerfis(req, res) {
        try {
            const perfis = await Perfil.findAll();
            return res.status(200).json(perfis);
        } catch (err) {
            // Retorna um erro genérico caso algo dê errado no servidor.
            return res.status(500).json({ message: 'Erro ao listar perfis.', error: err.message });
        }
    },

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
     * @description Cria um novo perfil.
     * @route POST /perfis
     */
    async criarPerfil(req, res) {
        const { nome } = req.body;

        // Validação básica para garantir que o nome foi enviado.
        if (!nome) {
            return res.status(400).json({ message: 'O nome do perfil é obrigatório.' });
        }

        try {
            // Verifica se um perfil com o mesmo nome já existe para evitar duplicatas.
            const perfilExistente = await Perfil.findOne({ where: { nome } });
            if (perfilExistente) {
                return res.status(409).json({ message: 'Um perfil com este nome já existe.' }); // 409 Conflict
            }

            const novoPerfil = await Perfil.create({ nome });
            return res.status(201).json(novoPerfil); // 201 Created

        } catch (err) {
            return res.status(500).json({ message: 'Erro ao criar perfil.', error: err.message });
        }
    },

    /**
     * @description Atualiza um perfil existente.
     * @route PUT /perfis/:id
     */
    async updatePerfil(req, res) {
        const { id } = req.params;
        const { nome } = req.body;

        if (!nome) {
            return res.status(400).json({ message: 'O nome do perfil é obrigatório.' });
        }

        try {
            const perfil = await Perfil.findByPk(id);
            if (!perfil) {
                return res.status(404).json({ message: 'Perfil não encontrado.' });
            }

            perfil.nome = nome;
            await perfil.save(); // Salva a alteração no banco de dados.

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

            // Cuidado: Adicionar lógica para impedir a exclusão de perfis em uso.
            // Ex: Verificar se algum usuário tem este perfil antes de deletar.

            await perfil.destroy();
            return res.status(204).send(); // 204 No Content - resposta padrão para delete com sucesso.
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao deletar perfil.', error: err.message });
        }
    }
};

module.exports = PerfilController;
