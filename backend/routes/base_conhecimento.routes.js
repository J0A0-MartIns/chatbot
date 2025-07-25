/**
 * Define os endpoints da API para o recurso da Base de Conhecimento.
 */

const express = require('express');
const router = express.Router();
const baseConhecimentoController = require('../controllers/base_conhecimento.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { pode } = require('../middlewares/permissao.middleware');
const upload = require('../config/multer');

router.post('/', authenticateToken, pode('criar_documento'), baseConhecimentoController.criarDocumento);
router.get('/', authenticateToken, baseConhecimentoController.listarDocumentos);
router.get('/subtema/:id_subtema', authenticateToken, baseConhecimentoController.buscarPorSubtema);
//router.get('/:id', authenticateToken, baseConhecimentoController.buscarDocumentoPorId);
router.put('/:id', authenticateToken, pode('editar_documento'), baseConhecimentoController.atualizarDocumento);
router.patch('/:id/ativo', authenticateToken, pode('publicar_documento'), baseConhecimentoController.atualizarAtivo);
router.delete('/:id', authenticateToken, pode('deletar_documento'), baseConhecimentoController.excluirDocumento);
router.post('/:id_documento/upload', authenticateToken, pode('editar_documento'), upload.single('arquivo'), baseConhecimentoController.uploadArquivo);

module.exports = router;
