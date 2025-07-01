/**
 * Fornece dados complexos e agregados para a página de Relatórios.
 */

const { AtendimentoChatbot, Feedback, BaseConhecimento, Subtema, Tema, SessaoUsuario, Usuario, sequelize } = require('../models');
const { Op } = require('sequelize');

const RelatorioController = {
    /**
     * @description Busca um relatório detalhado de todas as interações do chat.
     * @route GET /relatorios/interacoes
     */
    async getInteracoes(req, res) {
        const { id_tema, id_subtema } = req.query;
        try {
            const atendimentos = await AtendimentoChatbot.findAll({
                include: [
                    { model: Feedback, required: false },
                    {
                        model: SessaoUsuario,
                        include: [{ model: Usuario, as: 'Usuario', attributes: ['nome'] }]
                    },
                    {
                        model: BaseConhecimento,
                        as: 'Solucoes',
                        through: { attributes: [] },
                        required: false,
                        include: [{
                            model: Subtema,
                            as: 'Subtema',
                            where: id_subtema ? { id_subtema: id_subtema } : {},
                            include: [{
                                model: Tema,
                                as: 'tema',
                                where: id_tema && !id_subtema ? { id_tema: id_tema } : {}
                            }]
                        }]
                    }
                ],
                order: [['data_atendimento', 'DESC']]
            });

            const resultado = atendimentos.map(at => {
                const primeiraSolucao = at.Solucoes?.[0];
                return {
                    data_atendimento: at.data_atendimento,
                    pergunta_usuario: at.pergunta_usuario,
                    resposta_gerada: at.resposta_chatbot,
                    usuario: at.SessaoUsuario?.Usuario?.nome || 'Desconhecido',
                    avaliacao: at.Feedback?.avaliacao,
                    tema: primeiraSolucao?.Subtema?.tema?.nome || 'N/A',
                    sub_tema: primeiraSolucao?.Subtema?.nome || 'N/A'
                };
            });

            return res.status(200).json(resultado);
        } catch (error) {
            console.error("Erro ao gerar relatório de interações:", error);
            return res.status(500).json({ message: 'Erro ao gerar relatório de interações.', error: error.message });
        }
    },

    /**
     * @description Busca um relatório agregado do número de vezes que cada subtema foi usado.
     */
    async getUsoSubtema(req, res) {
        const { de, ate } = req.query;
        const whereClause = {};

        if (de && ate) {
            whereClause.data_atendimento = { [Op.between]: [new Date(de), new Date(ate)] };
        }

        try {
            const resultado = await Subtema.findAll({
                attributes: [
                    'id_subtema',
                    'nome',
                    [sequelize.fn('COUNT', sequelize.col('Documentos->AtendimentoChatbots.id_atendimento')), 'count']
                ],
                include: [{
                    model: BaseConhecimento,
                    as: 'Documentos',
                    attributes: [],
                    required: true,
                    include: [{
                        model: AtendimentoChatbot,
                        as: 'AtendimentoChatbots',
                        attributes: [],
                        through: { attributes: [] },
                        where: whereClause,
                        required: true
                    }]
                }],
                group: ['Subtema.id_subtema', 'Subtema.nome'],
                order: [[sequelize.literal('count'), 'DESC']]
            });

            return res.status(200).json(resultado);
        } catch (error) {
            console.error("Erro ao gerar relatório de uso de subtema:", error);
            return res.status(500).json({ message: 'Erro ao gerar relatório de uso.', error: error.message });
        }
    }
};

module.exports = RelatorioController;