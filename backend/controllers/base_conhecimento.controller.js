/**
 * Gerencia toda a lógica de negócio para os documentos da Base de Conhecimento.
 */

//Sequelize para usar transações
const { BaseConhecimento, Subtema, Tema, Usuario, DocumentoArquivo, sequelize } = require('../models');

const BaseConhecimentoController = {
    /**
     * @description Cria um novo documento na base de conhecimento.
     * @route POST /base-conhecimento
     */
    async criarDocumento(req, res) {
        const { titulo, conteudo, palavras_chave, id_subtema } = req.body;
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
                ativo: true
            });

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
                    {
                        model: Subtema,
                        include: [{
                            model: Tema,
                            as: 'tema'
                        }]
                    },
                    { model: Usuario, attributes: ['id_usuario', 'nome', 'email'] },
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
                    { model: Subtema, include: [{ model: Tema, as: 'tema' }] },
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
        const { ativo } = req.body;

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
     * @description Exclui um documento e, em seguida, verifica e remove
     * temas e subtemas que se tornaram órfãos.
     * @route DELETE /base-conhecimento/:id
     */
    async excluirDocumento(req, res) {
        const { id } = req.params;
        const transacao = await sequelize.transaction();

        try {
            const documento = await BaseConhecimento.findByPk(id, { transaction: transacao });
            if (!documento) {
                await transacao.rollback();
                return res.status(404).json({ message: 'Documento não encontrado.' });
            }

            const idSubtema = documento.id_subtema;

            // 1. Apaga o documento
            await documento.destroy({ transaction: transacao });

            // 2. Verifica se o subtema ficou órfão
            if (idSubtema) {
                const subtema = await Subtema.findByPk(idSubtema, { transaction: transacao });
                if (subtema) {
                    const idTema = subtema.id_tema;

                    const countDocsInSubtema = await BaseConhecimento.count({ where: { id_subtema: idSubtema }, transaction: transacao });

                    if (countDocsInSubtema === 0) {
                        // Se não houver mais documentos, apaga o subtema
                        await subtema.destroy({ transaction: transacao });

                        // 3. Verifica se o tema pai ficou órfão
                        const countSubtemasInTema = await Subtema.count({ where: { id_tema: idTema }, transaction: transacao });

                        if (countSubtemasInTema === 0) {
                            // Se não houver mais subtemas, apaga o tema
                            await Tema.destroy({ where: { id_tema: idTema }, transaction: transacao });
                        }
                    }
                }
            }

            //Confirma as alterações se der certo
            await transacao.commit();
            return res.status(204).send();

        } catch (err) {
            //Desfaz todas as alterações se der errado
            await transacao.rollback();
            return res.status(500).json({ message: 'Erro ao excluir documento e limpar órfãos.', error: err.message });
        }
    }
};

module.exports = BaseConhecimentoController;
