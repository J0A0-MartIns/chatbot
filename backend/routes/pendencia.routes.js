/**
 * Define os endpoints da API para o recurso de Pendências.
 */

const express = require('express');
const router = express.Router();
const pendenciaController = require('../controllers/pendencia.controller');
const { authenticateToken, authorizePerfil } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, authorizePerfil(['Admin']), pendenciaController.listarPendencias);
router.post('/:id/aprovar', authenticateToken, authorizePerfil(['Admin']), pendenciaController.aprovarPendencia);
router.delete('/:id', authenticateToken, authorizePerfil(['Admin']), pendenciaController.excluirPendencia);

module.exports = router;
