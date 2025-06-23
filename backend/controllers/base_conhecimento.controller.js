const { BaseConhecimento, SubTema, Tema, Usuario, DocumentoArquivo } = require('../models');

const KnowledgeController = {
    // 🔹 Listar todos os documentos
    async getAll(req, res) {
        try {
            const documentos = await BaseConhecimento.findAll({
                include: [
                    {
                        model: SubTema,
                        include: [Tema]
                    },
                    {
                        model: Usuario,
                        attributes: ['id_usuario', 'nome', 'email']
                    },
                    {
                        model: DocumentoArquivo
                    }
                ],
                order: [['data_criacao', 'DESC']]
            });

            return res.json(documentos);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar base de conhecimento.', error: err.message });
        }
    },

    // 🔹 Adicionar novo documento
    async create(req, res) {
        const { titulo, conteudo, palavras_chave, id_subtema, usuario_id, arquivos } = req.body;

        if (!titulo || !conteudo || !id_subtema || !usuario_id) {
            return res.status(400).json({ message: 'Campos obrigatórios não preenchidos.' });
        }

        try {
            const novoDoc = await BaseConhecimento.create({
                titulo,
                conteudo,
                palavras_chave,
                id_subtema,
                usuario_id,
                ativo: 1
            });

            // Registra arquivos, se houver
            if (arquivos && Array.isArray(arquivos)) {
                for (const nome_arquivo of arquivos) {
                    await DocumentoArquivo.create({
                        nome_arquivo,
                        id_documento: novoDoc.id_documento
                    });
                }
            }

            return res.status(201).json({ message: 'Documento adicionado com sucesso.', documento: novoDoc });
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao criar documento.', error: err.message });
        }
    },

    // 🔹 Atualizar documento
    async update(req, res) {
        const { id } = req.params;
        const { titulo, conteudo, palavras_chave, id_subtema, ativo, arquivos } = req.body;

        try {
            const documento = await BaseConhecimento.findByPk(id);
            if (!documento) return res.status(404).json({ message: 'Documento não encontrado.' });

            await documento.update({ titulo, conteudo, palavras_chave, id_subtema, ativo });

            // Atualizar arquivos
            if (arquivos && Array.isArray(arquivos)) {
                await DocumentoArquivo.destroy({ where: { id_documento: id } });

                for (const nome_arquivo of arquivos) {
                    await DocumentoArquivo.create({ nome_arquivo, id_documento: id });
                }
            }

            return res.json({ message: 'Documento atualizado com sucesso.', documento });
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao atualizar documento.', error: err.message });
        }
    },

    // 🔹 Remover documento
    async delete(req, res) {
        const { id } = req.params;

        try {
            const documento = await BaseConhecimento.findByPk(id);
            if (!documento) return res.status(404).json({ message: 'Documento não encontrado.' });

            await DocumentoArquivo.destroy({ where: { id_documento: id } });
            await documento.destroy();

            return res.json({ message: 'Documento removido com sucesso.' });
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao excluir documento.', error: err.message });
        }
    }
};

module.exports = KnowledgeController;
