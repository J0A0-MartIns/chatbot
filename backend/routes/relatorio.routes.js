/**
 * routes/relatorio.routes.js
 *
 * Define os endpoints da API para Relatórios.
 */

const express = require('express');
const router = express.Router();

const relatorioController = require('../controllers/relatorio.controller');
const { authenticateToken, pode } = require('../middlewares/permission.middleware');

// Uma permissão 'ver_relatorios' seria ideal aqui.
// Por enquanto, vamos proteger apenas com autenticação.
router.get('/', authenticateToken, relatorioController.getRelatorio);

module.exports = router;
