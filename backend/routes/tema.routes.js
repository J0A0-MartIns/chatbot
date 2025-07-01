/**
 * Define os endpoints da API para o recurso de Temas.
 */

const express = require('express');
const router = express.Router();

const temaController = require('../controllers/tema.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { pode } = require('../middlewares/permissao.middleware');

router.get('/', authenticateToken, temaController.listarTemas);
router.get('/:id', authenticateToken, pode('ver_categorias'), temaController.buscarTemaPorId);
router.post('/', authenticateToken, pode('criar_categorias'), temaController.criarTema);
router.put('/:id', authenticateToken, pode('editar_categorias'), temaController.atualizarTema);
router.delete('/:id', authenticateToken, pode('deletar_categorias'), temaController.removerTema);


module.exports = router;
