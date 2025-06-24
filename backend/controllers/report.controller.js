const {
    AtendimentoChatbot,
    Feedback,
    BaseChatbotSolucao,
    BaseConhecimento,
    SubTema,
    Tema
} = require('../models');
const { Op } = require('sequelize');

const ReportController = {
    async gerarRelatorio(req, res) {
        const { id_tema, id_subtema, data_inicio, data_fim } = req.query;

        try {
            // Filtro de data para atendimento
            const filtroData = {};
            if (data_inicio || data_fim) {
                filtroData.data_atendimento = {};
                if (data_inicio) filtroData.data_atendimento[Op.gte] = new Date(data_inicio);
                if (data_fim) filtroData.data_atendimento[Op.lte] = new Date(data_fim);
            }

            // Busca atendimentos com feedback e solução (documento usado)
            const atendimentos = await AtendimentoChatbot.findAll({
                where: filtroData,
                include: [
                    {
                        model: Feedback
                    },
                    {
                        model: BaseChatbotSolucao,
                        include: {
                            model: BaseConhecimento,
                            include: {
                                model: SubTema,
                                include: Tema
                            }
                        }
                    }
                ],
                order: [['data_atendimento', 'DESC']]
            });

            // Aplica filtros de tema/subtema no nível do JS
            const filtrados = atendimentos.filter(atendimento => {
                const doc = atendimento.base_chatbot_solucoes[0]?.base_conhecimento;
                const subtema = doc?.sub_tema;
                const tema = subtema?.tema;

                if (id_subtema && subtema?.id_subtema != id_subtema) return false;
                if (id_tema && tema?.id_tema != id_tema) return false;
                return true;
            });

            const resultado = filtrados.map(at => ({
                texto_entrada_usuario: at.texto_entrada_usuario,
                resposta_gerada: at.resposta_gerada,
                data_atendimento: at.data_atendimento,
                tema: at.base_chatbot_solucoes[0]?.base_conhecimento?.sub_tema?.tema?.nome || 'N/A',
                sub_tema: at.base_chatbot_solucoes[0]?.base_conhecimento?.sub_tema?.nome || 'N/A',
                avaliacao: at.feedback ? at.feedback.avaliacao : null
            }));

            return res.json(resultado);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao gerar relatório.', error: err.message });
        }
    }
};

module.exports = ReportController;
