const {
    AtendimentoChatbot,
    BaseConhecimento,
    SessaoUsuario,
    BaseChatbotSolucao,
    Feedback,
    Pendencia
} = require('../models');
const { Op } = require('sequelize');

const ChatController = {
    // 🔹 Faz uma pergunta e retorna a resposta (ou cria pendência)
    async ask(req, res) {
        const { usuarioId, pergunta } = req.body;

        if (!usuarioId || !pergunta) {
            return res.status(400).json({ message: 'Usuário e pergunta são obrigatórios.' });
        }

        try {
            const palavras = pergunta.toLowerCase().split(/\s+/);

            // 🔎 Busca documento correspondente por palavras-chave
            const documento = await BaseConhecimento.findOne({
                where: {
                    ativo: 1,
                    [Op.or]: palavras.map(p => ({
                        palavras_chave: {
                            [Op.iLike]: `%${p}%`
                        }
                    }))
                }
            });

            let respostaGerada = null;

            if (documento) {
                respostaGerada = documento.conteudo;
            }

            // 🔹 Cria registro do atendimento
            const atendimento = await AtendimentoChatbot.create({
                texto_entrada_usuario: pergunta,
                resposta_gerada: respostaGerada
            });

            // 🔹 Cria sessão (simplificada)
            const sessao = await SessaoUsuario.create({
                usuario_id: usuarioId,
                atendimento_id: atendimento.id_atendimento
            });

            // 🔹 Cria feedback inicial (sem avaliação)
            const feedback = await Feedback.create({
                atendimento_id: atendimento.id_atendimento,
                avaliacao: null
            });

            // 🔹 Se houver resposta, registra vínculo no histórico
            if (documento) {
                await BaseChatbotSolucao.create({
                    atendimento_id: atendimento.id_atendimento,
                    base_id: documento.id_documento,
                    ativo: 1
                });
            } else {
                // 🔹 Se não houver resposta, cria pendência
                await Pendencia.create({
                    id_feedback: feedback.id_feedback,
                    motivo: 'Sem correspondência na base'
                });
            }

            return res.json({
                encontrou: !!documento,
                resposta: documento ? documento.conteudo : null,
                atendimento_id: atendimento.id_atendimento
            });

        } catch (err) {
            return res.status(500).json({ message: 'Erro ao processar pergunta.', error: err.message });
        }
    },

    // 🔹 Avaliar se a resposta foi útil
    async rate(req, res) {
        const { atendimentoId, util } = req.body;

        if (typeof util !== 'boolean') {
            return res.status(400).json({ message: 'Avaliação inválida.' });
        }

        try {
            const feedback = await Feedback.findOne({
                where: { atendimento_id: atendimentoId }
            });

            if (!feedback) {
                return res.status(404).json({ message: 'Feedback não encontrado.' });
            }

            feedback.avaliacao = util ? 1 : 0;
            await feedback.save();

            return res.json({ message: 'Feedback registrado com sucesso.' });

        } catch (err) {
            return res.status(500).json({ message: 'Erro ao salvar feedback.', error: err.message });
        }
    }
};

module.exports = ChatController;
