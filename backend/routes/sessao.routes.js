/**
 * Define os endpoints da API relacionados às sessões dos usuários.
 */

const express = require('express');
const router = express.Router();
const sessaoController = require('../controllers/sessao_usuario.controller');
const {authenticateToken} = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/permissao.middleware');


router.get('/usuario/:id', authenticateToken, isAdmin, sessaoController.listarPorUsuario);
router.post('/logout', authenticateToken, sessaoController.finalizarSessao);

module.exports = router;
