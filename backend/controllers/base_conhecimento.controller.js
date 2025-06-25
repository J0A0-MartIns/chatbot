/**
 * controllers/base_conhecimento.controller.js
 *
 * Gerencia toda a lógica de negócio para os documentos da Base de Conhecimento.
 */

// Importa os modelos necessários. Corrigi 'SubTema' para 'Subtema' para consistência.
const { BaseConhecimento, Subtema, Tema, Usuario, DocumentoArquivo } = require('../models');

const BaseConhecimentoController = {
    /**
     * @description Cria um novo documento na base de conhecimento.
     * @route POST /base-conhecimento
     */
    async criarDocumento(req, res) {
        const { titulo, conteudo, palavras_chave, id_subtema, arquivos } = req.body;
        // O ID do usuário deve vir do token de autenticação para segurança.
        const usuario_id = req.user.id;

        if (!titulo || !conteudo || !id_subtema) {
            return res.status(400).json({ message: 'Os campos título, conteúdo e id_subtema são obrigatórios.' });
        }

        try {
            const novoDocumento = await BaseConhecimento.create({
                titulo,
                conteudo,
                palavras_chave,
                id_subtema,
                usuario_id,
                ativo: true // Documentos são criados como ativos por padrão
            });

            // Se houver arquivos anexados, cria os registros correspondentes.
            if (arquivos && Array.isArray(arquivos) && arquivos.length > 0) {
                const arquivosParaCriar = arquivos.map(nome_arquivo => ({
                    nome_arquivo,
                    id_documento: novoDocumento.id_documento
                }));
                await DocumentoArquivo.bulkCreate(arquivosParaCriar);
            }

            return res.status(201).json(novoDocumento);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao criar documento.', error: err.message });
        }
    },

    /**
     * @description Lista todos os documentos.
     * @route GET /base-conhecimento
     */
    async listarDocumentos(req, res) {
        try {
            const documentos = await BaseConhecimento.findAll({
                include: [
                    { model: Subtema, include: [Tema] },
                    { model: Usuario, attributes: ['id_usuario', 'nome', 'email'] }, // Não retornar senha
                    { model: DocumentoArquivo }
                ],
                order: [['data_criacao', 'DESC']]
            });
            return res.status(200).json(documentos);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao listar documentos.', error: err.message });
        }
    },

    /**
     * @description Busca um documento específico pelo seu ID.
     * @route GET /base-conhecimento/:id
     */
    async buscarDocumentoPorId(req, res) {
        try {
            const documento = await BaseConhecimento.findByPk(req.params.id, {
                include: [
                    { model: Subtema, include: [Tema] },
                    { model: Usuario, attributes: ['id_usuario', 'nome', 'email'] },
                    { model: DocumentoArquivo }
                ]
            });
            if (!documento) {
                return res.status(404).json({ message: 'Documento não encontrado.' });
            }
            return res.status(200).json(documento);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar documento.', error: err.message });
        }
    },

    /**
     * @description Busca documentos por um subtema específico.
     * @route GET /base-conhecimento/subtema/:id_subtema
     */
    async buscarPorSubtema(req, res) {
        try {
            const documentos = await BaseConhecimento.findAll({ where: { id_subtema: req.params.id_subtema } });
            return res.status(200).json(documentos);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar por subtema.', error: err.message });
        }
    },

    /**
     * @description Atualiza um documento existente.
     * @route PUT /base-conhecimento/:id
     */
    async atualizarDocumento(req, res) {
        const { id } = req.params;
        const { titulo, conteudo, palavras_chave, id_subtema } = req.body;
        try {
            const documento = await BaseConhecimento.findByPk(id);
            if (!documento) {
                return res.status(404).json({ message: 'Documento não encontrado.' });
            }
            await documento.update({ titulo, conteudo, palavras_chave, id_subtema });
            return res.status(200).json(documento);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao atualizar documento.', error: err.message });
        }
    },

    /**
     * @description Ativa ou desativa um documento.
     * @route PATCH /base-conhecimento/:id/ativo
     */
    async atualizarAtivo(req, res) {
        const { id } = req.params;
        const { ativo } = req.body; // Espera um booleano: true ou false

        if (typeof ativo !== 'boolean') {
            return res.status(400).json({ message: 'O campo "ativo" deve ser um valor booleano (true ou false).' });
        }

        try {
            const documento = await BaseConhecimento.findByPk(id);
            if (!documento) {
                return res.status(404).json({ message: 'Documento não encontrado.' });
            }
            documento.ativo = ativo;
            await documento.save();
            return res.status(200).json(documento);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao atualizar status do documento.', error: err.message });
        }
    },

    /**
     * @description Exclui um documento.
     * @route DELETE /base-conhecimento/:id
     */
    async excluirDocumento(req, res) {
        try {
            const documento = await BaseConhecimento.findByPk(req.params.id);
            if (!documento) {
                return res.status(404).json({ message: 'Documento não encontrado.' });
            }
            // Exclui os arquivos associados primeiro para manter a integridade do banco.
            await DocumentoArquivo.destroy({ where: { id_documento: req.params.id } });
            await documento.destroy();
            return res.status(204).send();
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao excluir documento.', error: err.message });
        }
    }
};

module.exports = BaseConhecimentoController;
