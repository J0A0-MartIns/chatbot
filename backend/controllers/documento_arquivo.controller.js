/**
 * controllers/documento_arquivo.controller.js
 *
 * Versão final com lógica de depuração robusta para a exclusão de ficheiros.
 */
const { DocumentoArquivo } = require('../models');
const fs = require('fs');
const path = require('path');

const DocumentoArquivoController = {
    /**
     * Exclui um ficheiro anexado (tanto o registo no DB quanto o ficheiro físico).
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

            // --- LÓGICA DE DEPURAÇÃO ---
            // Constrói o caminho absoluto para o ficheiro a partir da raiz do projeto
            const filePath = path.resolve(__dirname, '..', arquivo.caminho_arquivo);

            log_stderr(`[Excluir Arquivo] Caminho relativo do DB: ${arquivo.caminho_arquivo}`);
            log_stderr(`[Excluir Arquivo] Caminho absoluto construído: ${filePath}`);

            if (fs.existsSync(filePath)) {
                log_stderr(`[Excluir Arquivo] Ficheiro físico encontrado. A tentar apagar...`);
                fs.unlinkSync(filePath);
                log_stderr(`[Excluir Arquivo] Ficheiro físico apagado com sucesso.`);
            } else {
                log_stderr(`[Excluir Arquivo] AVISO: Ficheiro físico não encontrado em ${filePath}. A prosseguir para apagar apenas o registo do DB.`);
            }

            // Apaga o registo do banco de dados
            await arquivo.destroy();
            log_stderr(`[Excluir Arquivo] Registo do arquivo ID: ${id_arquivo} apagado do banco de dados.`);

            return res.status(204).send();
        } catch (err) {
            log_stderr(`[Excluir Arquivo] ERRO FATAL: ${err.message}`);
            console.error("Erro detalhado ao excluir arquivo:", err);
            return res.status(500).json({ message: 'Erro ao excluir arquivo.', error: err.message });
        }
    }
};

// Função helper para logs, para manter a consistência
function log_stderr(message) {
    console.log(message);
}

module.exports = DocumentoArquivoController;
