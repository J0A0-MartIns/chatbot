const express = require('express');
const router = express.Router();
const pendenciaController = require('../controllers/pendencia.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/permissao.middleware');

router.get('/', authenticateToken, isAdmin, pendenciaController.listarPendencias);
router.post('/:id/aprovar', authenticateToken, isAdmin, pendenciaController.aprovarPendencia);
router.delete('/:id', authenticateToken, isAdmin, pendenciaController.excluirPendencia);

module.exports = router;

