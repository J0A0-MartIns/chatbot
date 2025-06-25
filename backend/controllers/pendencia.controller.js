/**
 * controllers/pendencia.controller.js
 *
 * Gerencia a lógica de negócio para as pendências, que são sugestões de conteúdo
 * geradas a partir de feedbacks negativos dos usuários.
 */

const {
    Pendencia,
    Feedback,
    AtendimentoChatbot,
    SessaoUsuario,
    Usuario,
    BaseConhecimento,
    DocumentoArquivo
} = require('../models');

const PendenciaController = {
    /**
     * @description Lista todas as pendências com detalhes agregados de outras tabelas.
     * @route GET /pendencias
     */
    async listarPendencias(req, res) {
        try {
            const pendencias = await Pendencia.findAll({
                include: [{
                    model: Feedback,
                    include: [{ model: AtendimentoChatbot }]
                }],
                order: [['createdAt', 'DESC']]
            });

            // NOTA DE PERFORMANCE: O bloco abaixo executa uma query por pendência (N+1).
            // Para um volume alto de dados, considere otimizar com um join mais complexo ou uma view.
            const resultado = await Promise.all(
                pendencias.map(async (pendencia) => {
                    if (!pendencia.Feedback || !pendencia.Feedback.AtendimentoChatbot) {
                        return null; // Ignora pendências com dados associados ausentes
                    }
                    const sessao = await SessaoUsuario.findOne({
                        where: { id_sessao: pendencia.Feedback.AtendimentoChatbot.id_sessao },
                        include: [Usuario]
                    });
                    return {
                        id_pendencia: pendencia.id_pendencia,
                        pergunta: pendencia.Feedback.AtendimentoChatbot.pergunta_usuario,
                        resposta: pendencia.Feedback.AtendimentoChatbot.resposta_chatbot,
                        usuario: sessao?.Usuario?.nome || 'Desconhecido',
                        motivo: pendencia.motivo,
                        data_criacao: pendencia.createdAt
                    };
                })
            );

            // Filtra resultados nulos caso alguma associação falhe
            const resultadoFiltrado = resultado.filter(item => item !== null);

            return res.status(200).json(resultadoFiltrado);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar pendências.', error: err.message });
        }
    },

    /**
     * @description Aprova uma pendência, criando um novo documento na Base de Conhecimento.
     * @route POST /pendencias/:id/aprovar
     */
    async aprovarPendencia(req, res) {
        const { id } = req.params; // ID da pendência
        const { titulo, conteudo, palavras_chave, id_subtema, arquivos } = req.body;
        const usuario_id = req.user.id; // ID do admin que está aprovando

        try {
            const pendencia = await Pendencia.findByPk(id);
            if (!pendencia) {
                return res.status(404).json({ message: 'Pendência não encontrada.' });
            }

            // Cria o novo documento na base de conhecimento.
            const novoDoc = await BaseConhecimento.create({
                titulo,
                conteudo,
                palavras_chave,
                id_subtema,
                usuario_id, // Registra o admin que criou o documento
                ativo: true
            });

            // Adiciona arquivos, se houver.
            if (arquivos && Array.isArray(arquivos) && arquivos.length > 0) {
                const arquivosParaCriar = arquivos.map(nome => ({ nome_arquivo: nome, id_documento: novoDoc.id_documento }));
                await DocumentoArquivo.bulkCreate(arquivosParaCriar);
            }

            // Após a aprovação, remove a pendência e o feedback associado.
            await pendencia.destroy();
            if (pendencia.id_feedback) {
                await Feedback.destroy({ where: { id_feedback: pendencia.id_feedback } });
            }

            return res.status(200).json({ message: 'Pendência aprovada e adicionada à base de conhecimento.' });
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao aprovar pendência.', error: err.message });
        }
    },

    /**
     * @description Exclui/rejeita uma pendência.
     * @route DELETE /pendencias/:id
     */
    async excluirPendencia(req, res) {
        const { id } = req.params;
        try {
            const pendencia = await Pendencia.findByPk(id);
            if (!pendencia) {
                return res.status(404).json({ message: 'Pendência não encontrada.' });
            }

            // Remove a pendência e o feedback associado.
            await pendencia.destroy();
            if (pendencia.id_feedback) {
                await Feedback.destroy({ where: { id_feedback: pendencia.id_feedback } });
            }

            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao excluir pendência.', error: err.message });
        }
    }
};

module.exports = PendenciaController;
