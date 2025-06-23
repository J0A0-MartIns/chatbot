const {
    BaseConhecimento,
    Pendencia,
    AtendimentoChatbot,
    Feedback
} = require('../models');

const DashboardController = {
    async getEstatisticas(req, res) {
        try {
            const totalDocumentos = await BaseConhecimento.count({ where: { ativo: 1 } });
            const totalPendencias = await Pendencia.count();
            const totalPerguntas = await AtendimentoChatbot.count();
            const totalFeedbacks = await Feedback.count({ where: { avaliacao: { not: null } } });
            const totalUteis = await Feedback.count({ where: { avaliacao: 1 } });

            const taxaUtilidade = totalFeedbacks > 0
                ? ((totalUteis / totalFeedbacks) * 100).toFixed(1)
                : '0.0';

            return res.json({
                totalDocumentos,
                totalPendencias,
                totalPerguntas,
                taxaUtilidade: `${taxaUtilidade}%`
            });
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao obter dados do dashboard.', error: err.message });
        }
    }
};

module.exports = DashboardController;
