// routes/base_conhecimento.routes.js
const express = require('express');
const router = express.Router();
const baseConhecimentoController = require('../controllers/base_conhecimento.controller');

router.post('/', baseConhecimentoController.criarDocumento);
router.get('/', baseConhecimentoController.listarDocumentos);
router.get('/:id', baseConhecimentoController.buscarDocumentoPorId);
router.put('/:id', baseConhecimentoController.atualizarDocumento);
router.delete('/:id', baseConhecimentoController.excluirDocumento);
router.get('/microtema/:microtemaId', baseConhecimentoController.buscarPorMicrotema);
router.patch('/:id/ativo', baseConhecimentoController.atualizarAtivo);

module.exports = router;
