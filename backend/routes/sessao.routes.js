/**
 * routes/sessao.routes.js
 *
 * Define os endpoints da API relacionados às sessões dos usuários.
 */

const express = require('express');
const router = express.Router();

// Importa o controller de sessão.
const sessaoController = require('../controllers/sessao_usuario.controller');

// Importa os middlewares de autenticação e autorização usando desestruturação.
const { authenticateToken, authorizePerfil } = require('../middlewares/auth.middleware');


// --- Definição das Rotas ---

/**
 * @route   GET /sessoes/usuario/:id
 * @desc    Lista todas as sessões de um usuário específico.
 * @access  Privado (requer autenticação e perfil 'administrador')
 */
router.get(
    '/usuario/:id',
    authenticateToken,
    authorizePerfil(['administrador']), // Apenas administradores podem ver sessões de outros.
    sessaoController.listarPorUsuario
);

/**
 * @route   POST /sessoes/logout
 * @desc    Finaliza a sessão atual do usuário (faz logout).
 * @access  Privado (requer autenticação)
 */
router.post(
    '/logout',
    authenticateToken,
    sessaoController.finalizarSessao
);

module.exports = router;
