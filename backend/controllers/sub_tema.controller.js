/**
 * Gerencia a lógica de negócio para os Subtemas.
 */

const { Subtema, Tema } = require('../models');

const SubtemaController = {
    /**
     * @description Cria um novo subtema.
     */
    async criarSubtema(req, res) {
        const { nome, id_tema } = req.body;
        if (!nome || !id_tema) {
            return res.status(400).json({ message: 'Os campos nome e id_tema são obrigatórios.' });
        }
        try {
            const subtema = await Subtema.create({ nome, id_tema });
            return res.status(201).json(subtema);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao criar subtema.', error: err.message });
        }
    },

    /**
     * @description Lista todos os subtemas.
     */
    async listarSubtemas(req, res) {
        try {
            const subtemas = await Subtema.findAll({ include: [Tema] });
            return res.status(200).json(subtemas);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao listar subtemas.', error: err.message });
        }
    },

    /**
     * @description Lista todos os subtemas de um tema específico.
     */
    async listarPorTema(req, res) {
        const { id_tema } = req.params;
        try {
            const subtemas = await Subtema.findAll({ where: { id_tema } });
            return res.status(200).json(subtemas);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar subtemas por tema.', error: err.message });
        }
    },

    /**
     * @description Busca um subtema pelo seu ID.
     */
    async buscarSubtemaPorId(req, res) {
        try {
            const subtema = await Subtema.findByPk(req.params.id, { include: [Tema] });
            if (!subtema) {
                return res.status(404).json({ message: 'Subtema não encontrado.' });
            }
            return res.status(200).json(subtema);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar subtema.', error: err.message });
        }
    },

    /**
     * @description Atualiza um subtema existente.
     */
    async atualizarSubtema(req, res) {
        const { id } = req.params;
        const { nome, id_tema } = req.body;
        try {
            const subtema = await Subtema.findByPk(id);
            if (!subtema) {
                return res.status(404).json({ message: 'Subtema não encontrado.' });
            }
            await subtema.update({ nome, id_tema });
            return res.status(200).json(subtema);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao atualizar subtema.', error: err.message });
        }
    },

    /**
     * @description Remove um subtema.
     */
    async removerSubtema(req, res) {
        try {
            const subtema = await Subtema.findByPk(req.params.id);
            if (!subtema) {
                return res.status(404).json({ message: 'Subtema não encontrado.' });
            }
            await subtema.destroy();
            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao deletar subtema.', error: err.message });
        }
    }
};

module.exports = SubtemaController;
