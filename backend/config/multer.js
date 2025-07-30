/**
 * Configuração do middleware Multer para o upload de arquivos.
 */
const multer = require('multer');
const path = require('path');

// Define a estratégia de armazenamento dos arquivos
const armazenamento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/docs/');
    },
    // Define como os arquivos serão nomeados para evitar conflitos
    filename: (req, file, cb) => {
        // Cria um nome de arquivo único usando a data atual e o nome original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Cria a instância do multer com a configuração de armazenamento
const upload = multer({ storage: armazenamento });

module.exports = upload;