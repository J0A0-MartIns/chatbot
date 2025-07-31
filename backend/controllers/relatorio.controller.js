/**
 * Fornece dados para a página de Relatórios.
 */

const {AtendimentoChatbot, Feedback, BaseConhecimento, Subtema, Tema, SessaoUsuario, Usuario, sequelize} = require('../models');
const {Op} = require('sequelize');

const getPaginacao = (page, pageSize) => {
    const limit = pageSize ? +pageSize : 10;
    const offset = page ? (page - 1) * limit : 0;
    return { limit, offset };
};

const RelatorioController = {
    /**
     *Busca um relatório de todas as interações do chat.
     */
    async getInteracoes(req, res) {
        const {id_tema, id_subtema, dataInicio, dataFim, page, pageSize, exportar} = req.query;

        try {
            const whereAtendimento = {};
            if (dataInicio && dataFim) {
                const fim = new Date(dataFim);
                fim.setHours(23, 59, 59, 999);
                whereAtendimento.data_atendimento = {
                    [Op.between]: [new Date(dataInicio), fim]
                };
            }

            const whereSubtema = {};
            if (id_subtema) {
                whereSubtema.id_subtema = Number(id_subtema);
            }
            if (id_tema) {
                whereSubtema.id_tema = Number(id_tema);
            }

            const { limit, offset } = getPaginacao(page, pageSize);
            const paginacao = exportar === 'true' ? {} : { limit, offset };

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
                    attributes: ['id_documento', 'titulo'],
                    include: [{
                        model: Subtema,
                        as: 'Subtema',
                        required: !!(id_tema || id_subtema),
                        where: Object.keys(whereSubtema).length > 0 ? whereSubtema : null,
                        include: [{model: Tema, as: 'tema'}]
                    }]
                }
            ];

            const { count, rows: atendimentos } = await AtendimentoChatbot.findAndCountAll({
                where: whereAtendimento,
                include: opcoesInclusao,
                order: [['data_atendimento', 'DESC']],
                distinct: true,
                ...paginacao
            });

            const resultado = atendimentos.map(at => {
                const solucaoPrincipal = at.Solucoes?.[0];
                return {
                    data_atendimento: at.data_atendimento,
                    pergunta_usuario: at.pergunta_usuario,
                    resposta_gerada: at.resposta_chatbot,
                    usuario: at.SessaoUsuario?.Usuario?.nome || 'Desconhecido',
                    avaliacao: at.Feedback?.avaliacao,
                    tema: solucaoPrincipal?.Subtema?.tema?.nome || 'Solução não encontrada',
                    sub_tema: solucaoPrincipal?.Subtema?.nome || 'Solução não encontrada',
                    documento: solucaoPrincipal?.titulo || 'N/A'
                };
            });

            return res.status(200).json({ count, rows: resultado });
        } catch (error) {
            console.error("Erro ao gerar relatório de interações:", error);
            return res.status(500).json({message: 'Erro ao gerar relatório de interações.', error: error.message});
        }
    },

    /**
     * Busca um relatório do número de vezes que cada subtema foi usado.
     */
    async getUsoSubtema(req, res) {
        const {de, ate, page, pageSize} = req.query;
        const whereClause = {};

        if (de && ate) {
            const dataFim = new Date(ate);
            dataFim.setHours(23, 59, 59, 999);
            whereClause.data_atendimento = {[Op.between]: [new Date(de), dataFim]};
        }

        const { limit, offset } = getPaginacao(page, pageSize);

        try {
            const { count, rows } = await Subtema.findAndCountAll({
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
                        through: {attributes: []},
                        where: whereClause,
                        required: true
                    }]
                }],
                group: ['Subtema.id_subtema', 'Subtema.nome'],
                order: [[sequelize.literal('count'), 'DESC']],
                limit,
                offset,
                distinct: true,
                subQuery: false
            });

            const totalCount = count.length;

            return res.status(200).json({ count: totalCount, rows });
        } catch (error) {
            console.error("Erro ao gerar relatório de uso de subtema:", error);
            return res.status(500).json({message: 'Erro ao gerar relatório de uso.', error: error.message});
        }
    }
};

module.exports = RelatorioController;