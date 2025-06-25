/**
 * Este arquivo gerencia a lógica de negócio para as operações de CRUD
 * relacionadas aos Temas da base de conhecimento.
 */

const { Tema } = require('../models');

const TemaController = {
    /**
     * @description Cria um novo tema.
     * @route POST /temas
     */
    async criarTema(req, res) {
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ message: 'O nome do tema é obrigatório.' });
        }
        try {
            const temaExistente = await Tema.findOne({ where: { nome } });
            if (temaExistente) {
                return res.status(409).json({ message: 'Um tema com este nome já existe.' });
            }
            const tema = await Tema.create({ nome });
            return res.status(201).json(tema);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao criar tema.', error: err.message });
        }
    },

    /**
     * @description Lista todos os temas.
     * @route GET /temas
     */
    async listarTemas(req, res) {
        try {
            const temas = await Tema.findAll();
            return res.status(200).json(temas);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar temas.', error: err.message });
        }
    },

    /**
     * @description Busca um tema pelo seu ID.
     * @route GET /temas/:id
     */
    async buscarTemaPorId(req, res) {
        try {
            const tema = await Tema.findByPk(req.params.id);
            if (!tema) {
                return res.status(404).json({ message: 'Tema não encontrado.' });
            }
            return res.status(200).json(tema);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar tema.', error: err.message });
        }
    },

    /**
     * @description Atualiza um tema existente.
     * @route PUT /temas/:id
     */
    async atualizarTema(req, res) {
        const { id } = req.params;
        const { nome } = req.body;
        if (!nome) {
            return res.status(400).json({ message: 'O nome do tema é obrigatório.' });
        }
        try {
            const tema = await Tema.findByPk(id);
            if (!tema) {
                return res.status(404).json({ message: 'Tema não encontrado.' });
            }
            await tema.update({ nome });
            return res.status(200).json(tema);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao atualizar tema.', error: err.message });
        }
    },

    /**
     * @description Remove um tema.
     * @route DELETE /temas/:id
     */
    async removerTema(req, res) {
        try {
            const tema = await Tema.findByPk(req.params.id);
            if (!tema) {
                return res.status(404).json({ message: 'Tema não encontrado.' });
            }
            await tema.destroy();
            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao deletar tema.', error: err.message });
        }
    }
};

module.exports = TemaController;
