/**
 * Define os endpoints da API para o recurso de Pendências.
 */

const express = require('express');
const router = express.Router();
const pendenciaController = require('../controllers/pendencia.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { pode } = require('../middlewares/permissao.middleware');

router.get('/', authenticateToken, pode('listar_pendencias'), pendenciaController.listarPendencias);
router.post('/:id/aprovar', authenticateToken, pode('aprovar_pendencia'), pendenciaController.aprovarPendencia);
router.delete('/:id', authenticateToken, pode('rejeitar_pendencia'), pendenciaController.excluirPendencia);

module.exports = router;

