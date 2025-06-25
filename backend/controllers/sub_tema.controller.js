/**
 * controllers/sub_tema.controller.js
 *
 * Gerencia a lógica de negócio para as operações de CRUD relacionadas
 * aos Subtemas da base de conhecimento.
 */

// Importa os modelos Subtema e Tema. O modelo Tema é usado para validação.
const { Subtema, Tema } = require('../models');

const SubtemaController = {
    /**
     * @description Cria um novo subtema.
     * @route POST /subtemas
     */
    async criarSubtema(req, res) {
        const { nome, id_tema } = req.body;
        if (!nome || !id_tema) {
            return res.status(400).json({ message: 'Os campos nome e id_tema são obrigatórios.' });
        }
        try {
            // Validação opcional: verifica se o tema pai existe.
            const temaPai = await Tema.findByPk(id_tema);
            if (!temaPai) {
                return res.status(404).json({ message: 'O tema pai especificado não foi encontrado.' });
            }
            const subtema = await Subtema.create({ nome, id_tema });
            return res.status(201).json(subtema);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao criar subtema.', error: err.message });
        }
    },

    /**
     * @description Lista todos os subtemas.
     * @route GET /subtemas
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
     * @route GET /subtemas/tema/:id_tema
     */
    async listarPorTema(req, res) {
        const { id_tema } = req.params;
        try {
            const subtemas = await Subtema.findAll({ where: { id_tema } });
            if (!subtemas || subtemas.length === 0) {
                return res.status(404).json({ message: 'Nenhum subtema encontrado para este tema.' });
            }
            return res.status(200).json(subtemas);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar subtemas por tema.', error: err.message });
        }
    },

    /**
     * @description Busca um subtema pelo seu ID.
     * @route GET /subtemas/:id
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
     * @route PUT /subtemas/:id
     */
    async atualizarSubtema(req, res) {
        const { id } = req.params;
        const { nome, id_tema } = req.body; // Permite atualizar o nome e/ou o tema pai.
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
     * @route DELETE /subtemas/:id
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
