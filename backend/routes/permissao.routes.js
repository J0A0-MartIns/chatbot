const express = require('express');
const router = express.Router();
const permissaoController = require('../controllers/permissao.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Rota para buscar a lista completa de permissões, protegida por autenticação.
router.get('/', authenticateToken, permissaoController.listarTodas);

module.exports = router;
