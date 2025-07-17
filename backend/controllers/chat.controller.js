/**
 * Lógica de chat com IA (Llama 3) e criação de pendências.
 */

const {AtendimentoChatbot, Feedback, SessaoUsuario, BaseConhecimento, Pendencia, sequelize} = require('../models');
const {Op} = require('sequelize');
const { spawn } = require('child_process');
const path = require('path');
const axios = require('axios');

const ChatController = {
    /**
     * @description Recebe uma pergunta, e executa o script python com a ia para buscar a resposta.
     */
    async perguntar(req, res) {
        const { pergunta, id_subtema } = req.body;
        const id_usuario = req.user.id;

        if (!pergunta || !id_subtema || !id_usuario) {
            return res.status(400).json({ message: 'Pergunta, subtema e ID do usuário são obrigatórios.' });
        }

        try {
            const respostaDaIA = await axios.post('http://localhost:5001/responder', {
                pergunta: pergunta,
                id_subtema: id_subtema
            });
            if (respostaDaIA.data.error) {
                throw new Error(respostaDaIA.data.error);
            }
            const respostaFinal = respostaDaIA.data.resposta;
            const [sessao] = await SessaoUsuario.findOrCreate({
                where: { id_usuario, data_logout: null },
                defaults: { id_usuario }
            });
            const atendimento = await AtendimentoChatbot.create({
                id_sessao: sessao.id_sessao,
                pergunta_usuario: pergunta,
                resposta_chatbot: respostaFinal,
            });
            return res.status(200).json({
                id_atendimento: atendimento.id_atendimento,
                resposta: respostaFinal,
                encontrado: !respostaFinal.includes("não encontrei nenhuma informação")
            });

        } catch (error) {
            console.error("Erro ao comunicar com a API de IA:", error.response ? error.response.data : error.message);
            return res.status(500).json({ message: 'Erro ao processar pergunta.', error: error.message });
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

            if (avaliacao === true) {
                const atendimento = await AtendimentoChatbot.findByPk(id_atendimento);
                if (atendimento) {
                    try {
                        await axios.post('http://localhost:5001/salvar_cache', {
                            pergunta: atendimento.pergunta_usuario,
                            resposta: atendimento.resposta_chatbot
                        });
                        console.log("Cache salvo com sucesso.");
                    } catch (e) {
                        console.error("Erro ao salvar cache no Python:", e.message);
                    }
                }
            }
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
