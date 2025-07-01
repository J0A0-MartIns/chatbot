/**
 * Define as permissões
 */

const express = require('express');
const router = express.Router();
const permissaoController = require('../controllers/permissao.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.get('/', authenticateToken, permissaoController.listarTodas);

module.exports = router;
