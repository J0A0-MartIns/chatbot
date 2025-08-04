const express = require('express');
const router = express.Router();

const subTemaController = require('../controllers/sub_tema.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/permissao.middleware');


router.post('/', authenticateToken, isAdmin, subTemaController.criarSubtema);
router.get('/', authenticateToken, subTemaController.listarSubtemas);
router.get('/tema/:id_tema', authenticateToken, subTemaController.listarPorTema);
router.get('/:id', authenticateToken, subTemaController.buscarSubtemaPorId);
router.put('/:id', authenticateToken, isAdmin, subTemaController.atualizarSubtema);
router.delete('/:id', authenticateToken, isAdmin, subTemaController.removerSubtema);

module.exports = router;
