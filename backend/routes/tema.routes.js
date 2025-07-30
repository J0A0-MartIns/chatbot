/**
 * Define os endpoints da API para o recurso de Temas.
 */

const express = require('express');
const router = express.Router();

const temaController = require('../controllers/tema.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/permissao.middleware');

router.get('/', authenticateToken, temaController.listarTemas);
router.get('/:id', authenticateToken, isAdmin, temaController.buscarTemaPorId);
router.post('/', authenticateToken, isAdmin, temaController.criarTema);
router.put('/:id', authenticateToken, isAdmin, temaController.atualizarTema);
router.delete('/:id', authenticateToken, isAdmin, temaController.removerTema);


module.exports = router;
