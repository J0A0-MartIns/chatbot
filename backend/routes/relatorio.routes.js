/**
 * Define os endpoints da API para Relatórios.
 */

const express = require('express');
const router = express.Router();

const relatorioController = require('../controllers/relatorio.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
router.get('/', authenticateToken, relatorioController.getRelatorio);

module.exports = router;
