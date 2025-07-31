/**
 * Fornece dados para a página de Relatórios.
 */

const {
    AtendimentoChatbot,
    Feedback,
    BaseConhecimento,
    Subtema,
    Tema,
    SessaoUsuario,
    Usuario,
    sequelize
} = require('../models');
const {Op} = require('sequelize');

const RelatorioController = {
    /**
     *Busca um relatório de todas as interações do chat.
     */
    async getInteracoes(req, res) {
        const {id_tema, id_subtema, dataInicio, dataFim} = req.query;

        try {
            // Filtro de data
            const whereAtendimento = {};
            if (dataInicio && dataFim) {
                const fim = new Date(dataFim);
                fim.setHours(23, 59, 59, 999);
                whereAtendimento.data_atendimento = {
                    [Op.between]: [new Date(dataInicio), fim]
                };
            } else if (dataInicio) {
                whereAtendimento.data_atendimento = {
                    [Op.gte]: new Date(dataInicio)
                };
            } else if (dataFim) {
                const fim = new Date(dataFim);
                fim.setHours(23, 59, 59, 999);
                whereAtendimento.data_atendimento = {
                    [Op.lte]: fim
                };
            }

            const opcoesInclusao = [
                {model: Feedback, required: false},
                {
                    model: SessaoUsuario,
                    include: [{model: Usuario, as: 'Usuario', attributes: ['nome']}]
                },
                {
                    model: BaseConhecimento,
                    as: 'Solucoes',
                    through: {attributes: []},
                    required: false,
                    include: [{
                        model: Subtema,
                        as: 'Subtema',
                        required: false,
                        include: [{model: Tema, as: 'tema'}]
                    }]
                }
            ];

            const atendimentos = await AtendimentoChatbot.findAll({
                where: whereAtendimento,
                include: opcoesInclusao,
                order: [['data_atendimento', 'DESC']]
            });

            const resultado = atendimentos
                .filter(at => {
                    if (!id_tema && !id_subtema)
                        return true;
                    return at.Solucoes?.some(sol => {
                        const sub = sol.Subtema;
                        if (!sub) return false;
                        const temaMatch = !id_tema || sub.id_tema === Number(id_tema);
                        const subtemaMatch = !id_subtema || sub.id_subtema === Number(id_subtema);
                        return temaMatch && subtemaMatch;
                    });
                })
                .map(at => {
                    const solucao = (id_tema || id_subtema)
                        ? at.Solucoes?.find(sol => {
                            const sub = sol.Subtema;
                            if (!sub) return false;
                            const temaMatch = !id_tema || sub.id_tema === Number(id_tema);
                            const subtemaMatch = !id_subtema || sub.id_subtema === Number(id_subtema);
                            return temaMatch && subtemaMatch;
                        })
                        : at.Solucoes?.[0];

                    return {
                        data_atendimento: at.data_atendimento,
                        pergunta_usuario: at.pergunta_usuario,
                        resposta_gerada: at.resposta_chatbot,
                        usuario: at.SessaoUsuario?.Usuario?.nome || 'Desconhecido',
                        avaliacao: at.Feedback?.avaliacao,
                        tema: solucao?.Subtema?.tema?.nome || 'Solução não encontrada',
                        sub_tema: solucao?.Subtema?.nome || 'Solução não encontrada'
                    };
                });

            return res.status(200).json(resultado);
        } catch (error) {
            console.error("Erro ao gerar relatório de interações:", error);
            return res.status(500).json({message: 'Erro ao gerar relatório de interações.', error: error.message});
        }
    },

    /**
     * Busca um relatório do número de vezes que cada subtema foi usado.
     */
    async getUsoSubtema(req, res) {
        const {de, ate} = req.query;
        const whereClause = {};

        if (de && ate) {
            const dataFim = new Date(ate);
            dataFim.setHours(23, 59, 59, 999);
            whereClause.data_atendimento = {[Op.between]: [new Date(de), dataFim]};
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
                    required: false,
                    include: [{
                        model: AtendimentoChatbot,
                        as: 'AtendimentoChatbots',
                        attributes: [],
                        through: {attributes: []},
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
            return res.status(500).json({message: 'Erro ao gerar relatório de uso.', error: error.message});
        }
    }
};

module.exports = RelatorioController;