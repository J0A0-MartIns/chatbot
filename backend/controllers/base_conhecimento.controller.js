const { BaseConhecimento, Subtema, Tema, Usuario, DocumentoArquivo, sequelize } = require('../models');
const { spawn } = require('child_process');
const path = require('path');

const BaseConhecimentoController = {
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
            console.error("ERRO DETALHADO AO CRIAR DOCUMENTO:", err);
            return res.status(500).json({ message: 'Erro ao criar documento.', error: err.message });
        }
    },

    async listarDocumentos(req, res) {
        try {
            const documentos = await BaseConhecimento.findAll({
                include: [
                    {
                        model: Subtema,
                        as: 'Subtema',
                        include: [{
                            model: Tema,
                            as: 'tema'
                        }]
                    },
                    {
                        model: Usuario,
                        as: 'Usuario',
                        attributes: ['id_usuario', 'nome', 'email']
                    },
                    {
                        model: DocumentoArquivo,
                        as: 'DocumentoArquivos'
                    }
                ],
                order: [['data_criacao', 'DESC']]
            });
            return res.status(200).json(documentos);
        } catch (err) {
            console.error("ERRO DETALHADO AO LISTAR DOCUMENTOS:", err);
            return res.status(500).json({ message: 'Erro ao listar documentos.', error: err.message });
        }
    },

    // async buscarDocumentoPorId(req, res) {
    //     try {
    //         const documento = await BaseConhecimento.findByPk(req.params.id, {
    //             include: [
    //                 {
    //                     model: Subtema,
    //                     as: 'Subtema',
    //                     include: [{ model: Tema, as: 'tema' }]
    //                 },
    //                 {
    //                     model: Usuario,
    //                     as: 'Usuario',
    //                     attributes: ['id_usuario', 'nome', 'email']
    //                 }
    //                 // {
    //                 //     model: DocumentoArquivo,
    //                 //     as: 'DocumentoArquivos'
    //                 // }
    //             ]
    //         });
    //         if (!documento) {
    //             return res.status(404).json({ message: 'Documento não encontrado.' });
    //         }
    //         return res.status(200).json(documento);
    //     } catch (err) {
    //         return res.status(500).json({ message: 'Erro ao buscar documento.', error: err.message });
    //     }
    // },

    async buscarPorSubtema(req, res) {
        try {
            const documentos = await BaseConhecimento.findAll({
                where: { id_subtema: req.params.id_subtema }
            });
            return res.status(200).json(documentos);
        } catch (err) {
            return res.status(500).json({ message: 'Erro ao buscar por subtema.', error: err.message });
        }
    },

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

    async atualizarAtivo(req, res) {
        const { id } = req.params;
        const { ativo } = req.body;

        if (typeof ativo !== 'boolean') {
            return res.status(400).json({ message: 'O campo "ativo" deve ser um valor booleano.' });
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
            await documento.destroy({ transaction: transacao });

            if (idSubtema) {
                const subtema = await Subtema.findByPk(idSubtema, { transaction: transacao });
                if (subtema) {
                    const idTema = subtema.id_tema;
                    const countDocsInSubtema = await BaseConhecimento.count({
                        where: { id_subtema: idSubtema }, transaction: transacao
                    });

                    if (countDocsInSubtema === 0) {
                        await subtema.destroy({ transaction: transacao });

                        const countSubtemasInTema = await Subtema.count({
                            where: { id_tema: idTema }, transaction: transacao
                        });

                        if (countSubtemasInTema === 0) {
                            await Tema.destroy({ where: { id_tema: idTema }, transaction: transacao });
                        }
                    }
                }
            }

            await transacao.commit();
            return res.status(204).send();
        } catch (err) {
            await transacao.rollback();
            return res.status(500).json({ message: 'Erro ao excluir documento.', error: err.message });
        }
    },

    /**
     * Processa um arquivo enviado e o associa a um documento da base de conhecimento.
     * integrado com a IA
     */
    async uploadArquivo(req, res) {
        const { id_documento } = req.params;
        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum arquivo foi enviado.' });
        }

        try {
            const novoArquivo = await DocumentoArquivo.create({
                nome_original: req.file.originalname,
                nome_armazenado: req.file.filename,
                caminho_arquivo: req.file.path,
                tipo_mime: req.file.mimetype,
                tamanho_bytes: req.file.size,
                id_documento: id_documento
            });

            //Caminho para o script Python
            const pythonExecutable = process.platform === 'win32'
                ? path.join(__dirname, '..', '..', 'ia', 'venv', 'Scripts', 'python.exe')
                : path.join(__dirname, '..', '..', 'ia', 'venv', 'bin', 'python');

            const scriptPath = path.resolve(__dirname, '..', '..', 'ia', 'processador_documento.py');
            const filePath = path.resolve(__dirname, '..', req.file.path);

            console.log(`Chamando o script de IA...`);
            console.log(`Executável: ${pythonExecutable}`);
            console.log(`Script: ${scriptPath}`);

            const pythonProcess = spawn(pythonExecutable, [scriptPath, id_documento, filePath]);

            pythonProcess.stdout.on('data', (data) => {
                console.log(`[Python]: ${data.toString().trim()}`);
            });

            pythonProcess.stderr.on('data', (data) => {
                console.error(`[Python SCRIPT ERROR]: ${data.toString().trim()}`);
            });

            pythonProcess.on('close', (code) => {
                console.log(`[Node.js] Script Python finalizado com código ${code}.`);
            });

            pythonProcess.on('error', (err) => {
                console.error('[Node.js] Falha ao iniciar o processo do script Python:', err);
            });
            return res.status(201).json(novoArquivo);
        } catch (err) {
            console.error("ERRO AO SALVAR ARQUIVO:", err);
            return res.status(500).json({ message: 'Erro ao salvar o registo do arquivo.', error: err.message });
        }
    }
};
module.exports = BaseConhecimentoController;
