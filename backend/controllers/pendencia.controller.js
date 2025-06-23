const {
    Pendencia,
    Feedback,
    AtendimentoChatbot,
    SessaoUsuario,
    Usuario,
    SubTema,
    BaseConhecimento,
    DocumentoArquivo
} = require('../models');

const PendingController = {
    // 🔹 Listar todas as pendências com detalhes
    async getAll(req, res) {
        try {
            const pendencias = await Pendencia.findAll({
                include: [
                    {
                        model: Feedback,
                        include: [
                            {
                                model: AtendimentoChatbot
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            const resultado = await Promise.all(
                pendencias.map(async (pendencia) => {
                    const sessao = await SessaoUsuario.findOne({
                        where: { atendimento_id: pendencia.feedback.atendimento_id },
                        include: [Usuario]
                    });

                    return {
                        id_pendencia: pendencia.id_pendencia,
                        pergunta: pendencia.feedback.atendimento_chatbot.texto_entrada_usuario,
                        resposta: pendencia.feedback.atendimento_chatbot.resposta_gerada,
                        usuario: sessao?.usuario?.nome || 'Desconhecido',
                        motivo: pendencia.motivo
                    };
                })
            );

            return res.json(resultado);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar pendências.', error: err.message });
        }
    },

    // 🔹 Aprovar uma pendência (inserir na base de conhecimento)
    async aprovar(req, res) {
        const { id } = req.params;
        const { titulo, conteudo, palavras_chave, id_subtema, usuario_id, arquivos } = req.body;

        try {
            const pendencia = await Pendencia.findByPk(id, {
                include: [
                    {
                        model: Feedback,
                        include: [AtendimentoChatbot]
                    }
                ]
            });

            if (!pendencia) return res.status(404).json({ message: 'Pendência não encontrada.' });

            // Cria novo documento
            const novoDoc = await BaseConhecimento.create({
                titulo,
                conteudo,
                palavras_chave,
                id_subtema,
                usuario_id,
                ativo: 1
            });

            // Adiciona arquivos (se houver)
            if (arquivos && Array.isArray(arquivos)) {
                for (const nome_arquivo of arquivos) {
                    await DocumentoArquivo.create({ nome_arquivo, id_documento: novoDoc.id_documento });
                }
            }

            // Remove pendência e feedback relacionado
            await Feedback.destroy({ where: { id_feedback: pendencia.id_feedback } });
            await pendencia.destroy();

            return res.json({ message: 'Pendência aprovada e adicionada à base.' });

        } catch (err) {
            return res.status(500).json({ message: 'Erro ao aprovar pendência.', error: err.message });
        }
    },

    // 🔹 Excluir pendência
    async excluir(req, res) {
        const { id } = req.params;

        try {
            const pendencia = await Pendencia.findByPk(id);
            if (!pendencia) return res.status(404).json({ message: 'Pendência não encontrada.' });

            // Também apaga o feedback relacionado (e opcionalmente o atendimento)
            await Feedback.destroy({ where: { id_feedback: pendencia.id_feedback } });
            await pendencia.destroy();

            return res.json({ message: 'Pendência excluída com sucesso.' });

        } catch (err) {
            return res.status(500).json({ message: 'Erro ao excluir pendência.', error: err.message });
        }
    }
};

module.exports = PendingController;
