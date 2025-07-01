/**
 * Define os endpoints da API para o recurso de Subtemas.
 */

const express = require('express');
const router = express.Router();

const subTemaController = require('../controllers/sub_tema.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { pode } = require('../middlewares/permissao.middleware');


router.post('/', authenticateToken, pode('gerenciar_categorias'), subTemaController.criarSubtema);
router.get('/', authenticateToken, subTemaController.listarSubtemas);
router.get('/tema/:id_tema', authenticateToken, subTemaController.listarPorTema);
router.get('/:id', authenticateToken, subTemaController.buscarSubtemaPorId);
router.put('/:id', authenticateToken, pode('gerenciar_categorias'), subTemaController.atualizarSubtema);
router.delete('/:id', authenticateToken, pode('gerenciar_categorias'), subTemaController.removerSubtema);

module.exports = router;
