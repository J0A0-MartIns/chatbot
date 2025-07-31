/**
 * Lógica de negócio para as pendências
 */

const {Pendencia, Feedback, AtendimentoChatbot, SessaoUsuario, Usuario, BaseConhecimento, sequelize} = require('../models');

const PendenciaController = {
    /**
     * Lista todas as pendências.
     */
    async listarPendencias(req, res) {
        try {
            const pendencias = await Pendencia.findAll({
                include: [
                    {
                        model: AtendimentoChatbot,
                        include: [{
                            model: SessaoUsuario,
                            include: [{
                                model: Usuario,
                                as: 'Usuario',
                                attributes: ['nome']
                            }]
                        }]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            const resultado = pendencias.map(p => {
                if (!p.AtendimentoChatbot) return null;
                return {
                    id_pendencia: p.id_pendencia,
                    pergunta: p.AtendimentoChatbot.pergunta_usuario,
                    resposta: p.AtendimentoChatbot.resposta_chatbot,
                    usuario: p.AtendimentoChatbot.SessaoUsuario?.Usuario?.nome || 'Desconhecido',
                    motivo: p.motivo,
                    data_criacao: p.createdAt,
                    sugestao_tema: p.sugestao_tema,
                    sugestao_subtema: p.sugestao_subtema
                };
            }).filter(Boolean);

            return res.status(200).json(resultado);
        } catch (err) {
            console.error("Erro ao buscar pendências:", err);
            return res.status(500).json({ message: 'Erro ao buscar pendências.', error: err.message });
        }
    },

    /**
     * Aprova uma pendência, criando um novo documento na Base de Conhecimento
     */
    async aprovarPendencia(req, res) {
        const { id } = req.params; // ID da pendência
        const { titulo, conteudo, palavras_chave, id_subtema } = req.body;
        const usuario_id = req.user.id;

        const transacao = await sequelize.transaction();
        try {
            const pendencia = await Pendencia.findByPk(id, { transaction: transacao });
            if (!pendencia) {
                await transacao.rollback();
                return res.status(404).json({ message: 'Pendência não encontrada.' });
            }
            const novoDocumento = await BaseConhecimento.create({
                titulo,
                conteudo,
                palavras_chave,
                id_subtema,
                usuario_id,
                ativo: true
            }, { transaction: transacao });

            const idFeedback = pendencia.id_feedback;
            await pendencia.destroy({ transaction: transacao });
            if (idFeedback) {
                await Feedback.destroy({ where: { id_feedback: idFeedback }, transaction: transacao });
            }
            await transacao.commit();
            return res.status(200).json(novoDocumento);
        } catch (err) {
            await transacao.rollback();
            console.error("Erro ao aprovar pendência:", err);
            return res.status(500).json({ message: 'Erro ao aprovar pendência.', error: err.message });
        }
    },

    /**
     * Exclui uma pendência.
     */
    async excluirPendencia(req, res) {
        const { id } = req.params;
        const t = await sequelize.transaction();
        try {
            const pendencia = await Pendencia.findByPk(id, { transaction: t });
            if (!pendencia) {
                await t.rollback();
                return res.status(404).json({ message: 'Pendência não encontrada.' });
            }

            const idFeedback = pendencia.id_feedback;
            await pendencia.destroy({ transaction: t });
            if (idFeedback) {
                await Feedback.destroy({ where: { id_feedback: idFeedback }, transaction: t });
            }

            await t.commit();
            return res.status(204).send();
        } catch (err) {
            await t.rollback();
            console.error("Erro ao excluir pendência:", err);
            return res.status(500).json({ message: 'Erro ao excluir pendência.', error: err.message });
        }
    }
};

module.exports = PendenciaController;
