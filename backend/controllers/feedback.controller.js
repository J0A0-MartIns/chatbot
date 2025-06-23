const { feedback } = require('../models');

module.exports = {
    async create(req, res) {
        try {
            const { avaliacao, atendimento_chatbot_id_atendimento } = req.body;
            const novo = await feedback.create({ avaliacao, atendimento_chatbot_id_atendimento });
            res.status(201).json(novo);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao registrar feedback.' });
        }
    },

    async list(req, res) {
        try {
            const lista = await feedback.findAll();
            res.json(lista);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao listar feedbacks.' });
        }
    },

    async getById(req, res) {
        try {
            const id = req.params.id;
            const item = await feedback.findByPk(id);
            if (!item) return res.status(404).json({ error: 'Feedback não encontrado.' });
            res.json(item);
        } catch (error) {
            res.status(500).json({ error: 'Erro ao buscar feedback.' });
        }
    },

    async delete(req, res) {
        try {
            const id = req.params.id;
            const deletado = await feedback.destroy({ where: { id_feedback_busca: id } });
            if (!deletado) return res.status(404).json({ error: 'Feedback não encontrado.' });
            res.json({ message: 'Feedback deletado com sucesso.' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao deletar feedback.' });
        }
    }
};