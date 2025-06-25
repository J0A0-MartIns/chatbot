/**
 * Fornece dados para o dashboard.
 */

const { AtendimentoChatbot, Pendencia, sequelize } = require('../models');
const { Op } = require('sequelize');

const DashboardController = {
    /**
     * @description Busca estatísticas gerais para o Dashboard.
     * @route GET /dashboard/stats
     */
    async getStats(req, res) {
        try {
            //Conta as perguntas feitas no dia
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const perguntasHoje = await AtendimentoChatbot.count({
                where: {
                    data_atendimento: {
                        [Op.gte]: hoje
                    }
                }
            });

            //Conta as pendências
            const totalPendencias = await Pendencia.count();

            //Retorna todos os dados em um único objeto
            const stats = {
                perguntasHojeCount: perguntasHoje,
                pendenciasCount: totalPendencias
            };

            return res.status(200).json(stats);

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar estatísticas do dashboard.', error: error.message });
        }
    }
};

module.exports = DashboardController;
