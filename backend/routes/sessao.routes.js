/**
 * Define os endpoints da API relacionados às sessões dos usuários.
 */

const express = require('express');
const router = express.Router();
const sessaoController = require('../controllers/sessao_usuario.controller');
const {authenticateToken, authorizePerfil} = require('../middlewares/auth.middleware');


router.get('/usuario/:id', authenticateToken, authorizePerfil(['administrador']), sessaoController.listarPorUsuario);
router.post('/logout', authenticateToken, sessaoController.finalizarSessao);

module.exports = router;
