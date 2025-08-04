/**
 * Apenas para fornecer dados para o dashboard.
 */

const { AtendimentoChatbot, Pendencia, Usuario, sequelize } = require('../models');
const { Op } = require('sequelize');

const DashboardController = {
    /**
     * Busca dados gerais para o Dashboard.
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
    },

    /**
     * Calcula a taxa de respostas encontradas vs. não encontradas nos últimos 30 dias.
     */
    async getTaxaRespostas(req, res) {
        try {
            const trintaDiasAtras = new Date();
            trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

            const encontradas = await AtendimentoChatbot.count({
                where: {
                    data_atendimento: { [Op.gte]: trintaDiasAtras },
                    resposta_chatbot: { [Op.notLike]: '%não encontrei nenhuma informação%' }
                }
            });
            const naoEncontradas = await AtendimentoChatbot.count({
                where: {
                    data_atendimento: { [Op.gte]: trintaDiasAtras },
                    resposta_chatbot: { [Op.like]: '%não encontrei nenhuma informação%' }
                }
            });

            return res.status(200).json({ encontradas, naoEncontradas });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao buscar dados para o gráfico de taxa de respostas.' });
        }
    },

    /**
     * Calcula o volume de atendimentos por dia nos últimos x dias dias.
     */
    async getVolumeAtendimentos(req, res) {
        try {
            const dias = 7;
            const seteDiasAtras = new Date();
            seteDiasAtras.setDate(seteDiasAtras.getDate() - dias);
            seteDiasAtras.setHours(0, 0, 0, 0);

            const resultado = await AtendimentoChatbot.findAll({
                attributes: [
                    [sequelize.fn('date_trunc', 'day', sequelize.col('data_atendimento')), 'dia'],
                    [sequelize.fn('count', sequelize.col('id_atendimento')), 'count']
                ],
                where: {
                    data_atendimento: {[Op.gte]: seteDiasAtras}
                },
                group: ['dia'],
                order: [['dia', 'ASC']]
            });

            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(500).json({message: 'Erro ao buscar dados para o gráfico.'});
        }
    }
};

module.exports = DashboardController;
