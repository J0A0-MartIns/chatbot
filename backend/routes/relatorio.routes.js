const express = require('express');
const router = express.Router();

const relatorioController = require('../controllers/relatorio.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/permissao.middleware');

router.use(authenticateToken, isAdmin);
router.get('/interacoes', relatorioController.getInteracoes);
router.get('/uso-subtema', relatorioController.getUsoSubtema);

module.exports = router;