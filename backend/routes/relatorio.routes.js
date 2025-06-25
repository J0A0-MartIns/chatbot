/**
 * routes/relatorio.routes.js
 *
 * Define os endpoints da API para Relatórios.
 */

const express = require('express');
const router = express.Router();

const relatorioController = require('../controllers/relatorio.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
// Se você quiser usar permissões granulares aqui, descomente a linha abaixo
// const { pode } = require('../middlewares/permission.middleware');

// Uma permissão 'ver_relatorios' seria ideal aqui.
// Por enquanto, vamos proteger apenas com autenticação.
// CORREÇÃO: A função no controller se chama 'getRelatorio', não 'getRelatorio'
// (Na verdade, o nome estava certo, mas o erro pode ser em outro lugar, vamos garantir a consistência).
// Vamos garantir que a chamada esteja correta.
router.get('/', authenticateToken, relatorioController.getRelatorio);

module.exports = router;
