/**
 * controllers/chat.controller.js
 *
 * Centraliza a lógica de interação do chatbot.
 */

const { AtendimentoChatbot, Feedback, SessaoUsuario, BaseConhecimento } = require('../models');
const { Op } = require('sequelize');
const { getAuth } = require('firebase-admin/auth');

const ChatController = {
    /**
     * @description Recebe uma pergunta, busca uma resposta e registra o atendimento.
     * @route POST /chat/perguntar
     */
    async perguntar(req, res) {
        const { pergunta, id_subtema } = req.body;
        const usuario_id = req.user.id; // Pego do token JWT

        if (!pergunta || !id_subtema || !usuario_id) {
            return res.status(400).json({ message: 'Pergunta, subtema e ID do usuário são obrigatórios.' });
        }

        try {
            // --- 1. Lógica para buscar uma resposta ---
            // Esta é uma lógica SIMPLIFICADA. Em um sistema real, aqui entraria
            // um processamento de linguagem natural (NLP) ou busca por similaridade.
            const documento = await BaseConhecimento.findOne({
                where: {
                    id_subtema,
                    conteudo: { [Op.iLike]: `%${pergunta.split(' ')[0]}%` } // Busca simples pela primeira palavra
                },
                order: [['data_criacao', 'DESC']]
            });

            const resposta = documento ? documento.conteudo : 'Desculpe, não encontrei uma resposta para sua pergunta. Tente reformulá-la ou contate o suporte.';

            // --- 2. Registrar a Sessão e o Atendimento ---
            // Encontra ou cria uma sessão ativa para o usuário
            let sessao = await SessaoUsuario.findOne({ where: { usuario_id, data_logout: null } });
            if (!sessao) {
                sessao = await SessaoUsuario.create({ usuario_id });
            }

            const atendimento = await AtendimentoChatbot.create({
                id_sessao: sessao.id_sessao,
                pergunta_usuario: pergunta,
                resposta_chatbot: resposta,
            });

            // --- 3. Retornar a resposta e o ID do atendimento ---
            return res.status(200).json({
                id_atendimento: atendimento.id_atendimento,
                resposta: resposta
            });

        } catch (error) {
            return res.status(500).json({ message: 'Erro ao processar pergunta.', error: error.message });
        }
    },

    /**
     * @description Salva o feedback (positivo/negativo) de um atendimento.
     * @route POST /chat/feedback
     */
    async darFeedback(req, res) {
        const { id_atendimento, avaliacao } = req.body; // avaliacao: true (útil), false (não útil)

        if (!id_atendimento || avaliacao === undefined) {
            return res.status(400).json({ message: 'ID do atendimento e avaliação são obrigatórios.' });
        }

        try {
            await Feedback.create({
                atendimento_chatbot_id_atendimento: id_atendimento,
                avaliacao: avaliacao
            });

            // Se o feedback foi negativo, poderia criar uma Pendência aqui
            if (avaliacao === false) {
                // Lógica para criar uma pendência
            }

            return res.status(201).json({ message: 'Feedback registrado com sucesso.' });
        } catch (error) {
            return res.status(500).json({ message: 'Erro ao registrar feedback.', error: error.message });
        }
    }
};

module.exports = ChatController;
