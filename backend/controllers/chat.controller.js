/**
 * Lógica de chat com busca por palavra-chave e criação de pendências.
 */

const {AtendimentoChatbot, Feedback, SessaoUsuario, BaseConhecimento, Pendencia, sequelize} = require('../models');
const {Op} = require('sequelize');

const ChatController = {
    /**
     * @description Recebe uma pergunta, busca por palavras-chave e retorna uma resposta.
     */
    async perguntar(req, res) {
        const {pergunta, id_subtema} = req.body;
        const usuario_id = req.user.id;

        if (!pergunta || !id_subtema || !usuario_id) {
            return res.status(400).json({message: 'Pergunta, subtema e ID do utilizador são obrigatórios.'});
        }

        try {
            //Busca por múltiplos docs...
            const palavras = pergunta.toLowerCase().split(' ').filter(p => p.length > 2);
            let documentos = [];

            if (palavras.length > 0) {
                const condicoesDeBusca = palavras.map(p => ({
                    palavras_chave: {[Op.iLike]: `%${p}%`}
                }));
                documentos = await BaseConhecimento.findAll({
                    where: {
                        id_subtema: id_subtema,
                        [Op.or]: condicoesDeBusca
                    },
                    limit: 5,
                    order: [['data_criacao', 'DESC']]
                });
            }

            const respostaEncontrada = documentos.length > 0;
            const respostaGenerica = 'Desculpe, não encontrei uma resposta para sua pergunta neste subtema. Deseja que eu registe a sua dúvida como uma sugestão?';

            //Faz o registro do atendimento
            const [sessao] = await SessaoUsuario.findOrCreate({
                where: {usuario_id, data_logout: null},
                defaults: {usuario_id}
            });

            const atendimento = await AtendimentoChatbot.create({
                id_sessao: sessao.id_sessao,
                pergunta_usuario: pergunta,
                resposta_chatbot: respostaEncontrada ? `Encontrei ${documentos.length} soluções.` : respostaGenerica,
            });

            //Liga as soluções
            if (respostaEncontrada) {
                await atendimento.addSolucoes(documentos);
            }

            //Retorn a solução e o id do atendimento
            return res.status(200).json({
                id_atendimento: atendimento.id_atendimento,
                solucoes: documentos,
                encontrado: respostaEncontrada
            });

        } catch (error) {
            console.error("Erro no controller do chat:", error);
            return res.status(500).json({message: 'Erro ao processar pergunta.', error: error.message});
        }
    },

    /**
     * @description Salva o feedback e, se for negativo, cria uma pendência automaticamente.
     */
    async darFeedback(req, res) {
        const {id_atendimento, avaliacao, comentario} = req.body;
        if (id_atendimento === null || avaliacao === undefined) {
            return res.status(400).json({message: 'ID do atendimento e avaliação são obrigatórios.'});
        }

        const transacao = await sequelize.transaction();
        try {
            const novoFeedback = await Feedback.create({
                atendimento_chatbot_id_atendimento: id_atendimento,
                avaliacao: avaliacao,
                comentario: comentario
            }, {transaction: transacao});

            if (avaliacao === false) {
                await Pendencia.create({
                    id_feedback: novoFeedback.id_feedback,
                    motivo: comentario || 'O utilizador não forneceu um motivo.',
                    id_atendimento: id_atendimento
                }, {transaction: transacao});
            }

            await transacao.commit();
            return res.status(201).json({message: 'Feedback registado com sucesso.'});

        } catch (error) {
            await transacao.rollback();
            return res.status(500).json({message: 'Erro ao registar feedback.', error: error.message});
        }
    },

    /**
     * @description Cria uma pendência diretamente (para o cenário em que não há resposta).
     */
    async criarPendenciaDireta(req, res) {
        const {id_atendimento} = req.body;
        if (!id_atendimento) {
            return res.status(400).json({message: 'ID do atendimento é obrigatório.'});
        }
        try {
            await Pendencia.create({
                id_atendimento: id_atendimento,
                motivo: 'O bot não encontrou uma resposta para a pergunta do usuário.'
            });
            return res.status(201).json({message: 'A sua sugestão foi enviada com sucesso!'});
        } catch (error) {
            return res.status(500).json({message: 'Erro ao criar pendência.', error: error.message});
        }
    }
};

module.exports = ChatController;
