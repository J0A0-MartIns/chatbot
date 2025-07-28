const { DocumentoArquivo, DocumentoParagrafoEmbedding } = require('../models');
const fs = require('fs');
const path = require('path');

const DocumentoArquivoController = {
    /**
     * Exclui um arquivo anexado, tanto no registo do bd quanto no arquivo físico.
     */
    async excluirArquivo(req, res) {
        const { id_arquivo } = req.params;
        log_stderr(`[Excluir Arquivo] Recebido pedido para excluir o arquivo ID: ${id_arquivo}`);

        try {
            const arquivo = await DocumentoArquivo.findByPk(id_arquivo);
            if (!arquivo) {
                log_stderr(`[Excluir Arquivo] Arquivo ID: ${id_arquivo} não encontrado no banco de dados.`);
                return res.status(404).json({ message: 'Arquivo não encontrado.' });
            }

            const excluidos = await DocumentoParagrafoEmbedding.destroy({
                where: { id_arquivo: id_arquivo }
            });
            log_stderr(`[Excluir Arquivo] ${excluidos} embeddings excluídos do banco.`);

            const filePath = path.resolve(__dirname, '..', arquivo.caminho_arquivo);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                log_stderr(`[Excluir Arquivo] Arquivo físico excluído.`);
            }

            await arquivo.destroy();
            log_stderr(`[Excluir Arquivo] Registro do arquivo removido.`);

            return res.status(204).send();
        } catch (err) {
            log_stderr(`[Excluir Arquivo] ERRO FATAL: ${err.message}`);
            return res.status(500).json({ message: 'Erro ao excluir arquivo.', error: err.message });
        }
    }
};

function log_stderr(message) {
    console.log(message);
}

module.exports = DocumentoArquivoController;
