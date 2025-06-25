/**
 * controllers/relatorio.controller.js
 */

//Precisa de correção e adições ... verificar
const { AtendimentoChatbot, Feedback, BaseChatbotSolucao, BaseConhecimento, Subtema, Tema } = require('../models');
const { Op } = require('sequelize');

const RelatorioController = {
    async getRelatorio(req, res) {
        try {
            const atendimentos = await AtendimentoChatbot.findAll({
                include: [
                    { model: Feedback, required: false },
                    {
                        model: BaseChatbotSolucao,
                        include: [{
                            model: BaseConhecimento,
                            include: [{
                                model: Subtema,
                                include: [
                                    {
                                        model: Tema,
                                        as: 'tema'
                                    }
                                ]
                            }]
                        }],
                        required: false
                    }
                ],
            });
            return res.status(200).json(relatorio);
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao gerar relatório.', error: error.message });
        }
    }
};

module.exports = RelatorioController;
