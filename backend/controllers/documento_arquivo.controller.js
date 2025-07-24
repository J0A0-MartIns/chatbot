/**
* Controller do arquivo
 */
const { DocumentoArquivo } = require('../models');
const fs = require('fs');
const path = require('path');

const DocumentoArquivoController = {
    /**
     * Exclui um arquivo anexado (tanto o registo do bd quanto o arquivo físico).
     */
    async excluirArquivo(req, res) {
        const { id_arquivo } = req.params;
        try {
            const arquivo = await DocumentoArquivo.findByPk(id_arquivo);
            if (!arquivo) {
                return res.status(404).json({ message: 'Arquivo não encontrado.' });
            }

            const filePath = path.resolve(__dirname, '..', arquivo.caminho_arquivo);

            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }

            await arquivo.destroy();

            return res.status(204).send();
        } catch (err) {
            console.error("Erro ao excluir arquivo:", err);
            return res.status(500).json({ message: 'Erro ao excluir arquivo.', error: err.message });
        }
    }
};

module.exports = DocumentoArquivoController;