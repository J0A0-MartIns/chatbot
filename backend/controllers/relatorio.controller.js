/**
 * controllers/relatorio.controller.js
 *
 * Fornece dados complexos para a geração de relatórios.
 */

const { AtendimentoChatbot, Feedback, BaseChatbotSolucao, BaseConhecimento, Subtema, Tema } = require('../models');
const { Op } = require('sequelize');

const RelatorioController = {
    /**
     * @description Busca um relatório de interações com filtros opcionais.
     * @route GET /relatorios
     */
    async getRelatorio(req, res) {
        const { de, ate, tema, subtema } = req.query;
        const whereClause = {};

        // Adiciona filtro de data se fornecido
        if (de && ate) {
            whereClause.data_atendimento = { [Op.between]: [new Date(de), new Date(ate)] };
        }

        try {
            const atendimentos = await AtendimentoChatbot.findAll({
                where: whereClause,
                include: [
                    { model: Feedback, required: false }, // required: false = LEFT JOIN
                    {
                        model: BaseChatbotSolucao,
                        include: [{
                            model: BaseConhecimento,
                            include: [{
                                model: Subtema,
                                include: [Tema]
                            }]
                        }],
                        required: false
                    }
                ],
                order: [['data_atendimento', 'DESC']]
            });

            // Formata os dados para corresponder ao que o front-end espera
            let relatorio = atendimentos.map(at => {
                const primeiraSolucao = at.BaseChatbotSolucaos?.[0]?.BaseConhecimento;
                return {
                    id_atendimento: at.id_atendimento,
                    texto_entrada_usuario: at.pergunta_usuario,
                    resposta_gerada: at.resposta_chatbot,
                    data_atendimento: at.data_atendimento,
                    avaliacao: at.Feedback?.avaliacao ?? null, // Usa '??' para tratar nulos
                    tema: primeiraSolucao?.Subtema?.Tema?.nome,
                    sub_tema: primeiraSolucao?.Subtema?.nome
                };
            });

            // Aplica filtros de tema/subtema no resultado formatado
            if (tema) {
                relatorio = relatorio.filter(item => item.tema === tema);
            }
            if (subtema) {
                relatorio = relatorio.filter(item => item.sub_tema === subtema);
            }

            return res.status(200).json(relatorio);

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao gerar relatório.', error: error.message });
        }
    }
};

module.exports = RelatorioController;
