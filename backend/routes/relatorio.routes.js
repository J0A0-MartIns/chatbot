/**
 * Define os endpoints da API para os diferentes tipos de Relatórios.
 */

const express = require('express');
const router = express.Router();

const relatorioController = require('../controllers/relatorio.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { pode } = require('../middlewares/permissao.middleware');

router.use(authenticateToken, pode('ver_relatorios'));
router.get('/interacoes', relatorioController.getInteracoes);
router.get('/uso-subtema', relatorioController.getUsoSubtema);

module.exports = router;