/**
 * Lógica de chat com IA (Llama 3) e criação de pendências.
 */

const {AtendimentoChatbot, Feedback, SessaoUsuario, Pendencia, sequelize, Tema, Subtema, BaseConhecimento} = require('../models');
const axios = require('axios');
const {Op} = require("sequelize");

const ChatController = {
    /**
     * Recebe uma pergunta, e executa o script python com a ia para buscar a resposta.
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
            const { resposta, solucoes } = respostaDaIA.data;
            const encontrado = !resposta.includes("não encontrei nenhuma informação");

            const [sessao] = await SessaoUsuario.findOrCreate({
                where: { id_usuario, data_logout: null },
                defaults: { id_usuario }
            });

            const atendimento = await AtendimentoChatbot.create({
                id_sessao: sessao.id_sessao,
                pergunta_usuario: pergunta,
                resposta_chatbot: resposta,
            });

            let solucoesCompletas = [];
            if (encontrado && solucoes && solucoes.length > 0) {
                const idsDocumentos = solucoes.map(s => s.id_documento);
                solucoesCompletas = await BaseConhecimento.findAll({
                    where: { id_documento: { [Op.in]: idsDocumentos } },
                    include: [{
                        model: Subtema,
                        as: 'Subtema',
                        include: [{ model: Tema, as: 'tema' }]
                    }]
                });
                await atendimento.addSolucoes(idsDocumentos);
            }

            return res.status(200).json({
                id_atendimento: atendimento.id_atendimento,
                resposta: resposta,
                encontrado: encontrado,
                solucoes: solucoesCompletas
            });

        } catch (error) {
            console.error("Erro ao comunicar com a API de IA:", error.response ? error.response.data : error.message);
            return res.status(500).json({ message: 'Erro ao processar pergunta.', error: error.message });
        }
    },

    /**
     * Salva o feedback e, se for negativo, cria uma pendência automaticamente (sem categorização por IA).
     */
    async darFeedback(req, res) {
        const {id_atendimento, avaliacao, comentario, tema, subtema} = req.body;
        if (id_atendimento === null) {
            return res.status(400).json({message: 'ID do atendimento é obrigatório.'});
        }
        const transacao = await sequelize.transaction();
        try {
            const novoFeedback = await Feedback.create({
                atendimento_chatbot_id_atendimento: id_atendimento,
                avaliacao: avaliacao,
                comentario: comentario
            }, {transaction: transacao});

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
     * Cria uma pendência diretamente (categorização pela IA).
     */
    async criarPendenciaDireta(req, res) {
        const {id_atendimento} = req.body;
        if (!id_atendimento) {
            return res.status(400).json({message: 'ID do atendimento é obrigatório.'});
        }
        const solicitacao = await sequelize.transaction();
        try {
            const atendimento = await AtendimentoChatbot.findByPk(id_atendimento);
            if (!atendimento) {
                return res.status(404).json({ message: 'Atendimento não encontrado.' });
            }

            const novaPendencia = await Pendencia.create({
                id_atendimento: id_atendimento,
                motivo: 'O bot não encontrou uma resposta para a pergunta do usuário.'
            }, { transaction: solicitacao });

            const temas = await Tema.findAll({
                include: [{ model: Subtema, as: 'subtemas' }]
            });

            const categoriasLimpas = temas.map(tema => ({
                nome: tema.nome,
                subtemas: tema.subtemas.map(subtema => subtema.nome)
            }));

            const respostaIA = await axios.post('http://localhost:5001/categorizar', {
                pergunta: atendimento.pergunta_usuario,
                categorias: categoriasLimpas
            });

            const sugestao = respostaIA.data;
            if (sugestao.tema && sugestao.subtema) {
                novaPendencia.sugestao_tema = sugestao.tema;
                novaPendencia.sugestao_subtema = sugestao.subtema;
                await novaPendencia.save({ transaction: solicitacao });
            }

            await solicitacao.commit();
            return res.status(201).json({ message: 'A sua sugestão foi enviada com sucesso e está a ser analisada.' });
        } catch (error) {
            await solicitacao.rollback();
            console.error("Erro ao criar pendência com IA:", error.response ? error.response.data : error.message);
            return res.status(500).json({ message: 'Erro ao criar pendência.', error: error.message });
        }
    }
};

module.exports = ChatController;
