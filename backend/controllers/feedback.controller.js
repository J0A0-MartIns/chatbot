/**
 * Gerencia a lógica de negócio para o feedback dos usuários sobre os atendimentos.
 */

const { Feedback, AtendimentoChatbot } = require('../models');

const FeedbackController = {
    /**
     * @description Cria um novo feedback para um atendimento.
     * @route POST /feedbacks
     */
    async criarFeedback(req, res) {
        try {
            const { avaliacao, atendimento_chatbot_id_atendimento } = req.body;
            if (avaliacao === undefined || !atendimento_chatbot_id_atendimento) {
                return res.status(400).json({ message: 'Os campos avaliacao e atendimento_chatbot_id_atendimento são obrigatórios.' });
            }
            const novoFeedback = await Feedback.create({ avaliacao, atendimento_chatbot_id_atendimento });
            return res.status(201).json(novoFeedback);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao registrar feedback.', error: error.message });
        }
    },

    /**
     * @description Lista todos os feedbacks recebidos.
     * @route GET /feedbacks
     */
    async listarFeedbacks(req, res) {
        try {
            const feedbacks = await Feedback.findAll({
                include: [AtendimentoChatbot],
                order: [['createdAt', 'DESC']]
            });
            return res.status(200).json(feedbacks);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao listar feedbacks.', error: error.message });
        }
    },

    /**
     * @description Busca um feedback específico pelo seu ID.
     * @route GET /feedbacks/:id
     */
    async buscarFeedbackPorId(req, res) {
        try {
            const { id } = req.params;
            const feedback = await Feedback.findByPk(id, { include: [AtendimentoChatbot] });
            if (!feedback) {
                return res.status(404).json({ message: 'Feedback não encontrado.' });
            }
            return res.status(200).json(feedback);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar feedback.', error: error.message });
        }
    },

    /**
     * @description Deleta um feedback.
     * @route DELETE /feedbacks/:id
     */
    async deletarFeedback(req, res) {
        try {
            const { id } = req.params;
            const deletadoCount = await Feedback.destroy({ where: { id_feedback: id } });
            if (deletadoCount === 0) {
                return res.status(404).json({ message: 'Feedback não encontrado.' });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao deletar feedback.', error: error.message });
        }
    }
};

module.exports = FeedbackController;
