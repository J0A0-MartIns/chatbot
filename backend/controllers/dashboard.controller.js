/**
 * Fornece dados para o dashboard.
 */

const { AtendimentoChatbot, Pendencia, Usuario } = require('../models');
const { Op } = require('sequelize');

const DashboardController = {
    /**
     * @description Busca estatísticas gerais para o Dashboard.
     */
    async getStats(req, res) {
        try {
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);
            const amanha = new Date(hoje);
            amanha.setDate(hoje.getDate() + 1);

            const respostasEncontradasHoje = await AtendimentoChatbot.count({
                where: {
                    data_atendimento: {
                        [Op.gte]: hoje,
                        [Op.lt]: amanha
                    },
                    resposta_chatbot: {
                        [Op.notLike]: '%não encontrei nenhuma informação%'
                    }
                }
            });

            const usuariosAtivosCount = await Usuario.count({
                where: { status: 'ativo' }
            });

            const pendenciasCount = await Pendencia.count();

            const usuariosPendentesCount = await Usuario.count({
                where: { status: 'pendente' }
            });

            //Retorna todos os dados em um único objeto
            return res.status(200).json({
                respostasEncontradasHoje,
                usuariosAtivosCount,
                pendenciasCount,
                usuariosPendentesCount
            });


        } catch (error) {
            console.error("Erro ao buscar estatísticas do dashboard:", error);
            return res.status(500).json({ message: 'Erro ao buscar estatísticas.', error: error.message });
        }
    }
};

module.exports = DashboardController;
