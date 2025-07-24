const express = require('express');
const router = express.Router();
const documentoArquivoController = require('../controllers/documento_arquivo.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { pode } = require('../middlewares/permissao.middleware');

router.delete('/:id_arquivo', authenticateToken, pode('editar_documento'), documentoArquivoController.excluirArquivo);

module.exports = router;