/**
 * routes/chat.routes.js
 *
 * Define os endpoints da API para o Chat.
 */

const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Todas as rotas de chat exigem que o utilizador esteja logado.
router.use(authenticateToken);

// Rota para fazer uma pergunta
router.post('/perguntar', chatController.perguntar);

// Rota para dar um feedback (e criar uma pendência se for negativo)
router.post('/feedback', chatController.darFeedback);

// --- CORREÇÃO: ADICIONE ESTA ROTA ---
// Rota para criar uma pendência diretamente quando o bot não encontra uma resposta.
router.post('/pendencia', chatController.criarPendenciaDireta);

module.exports = router;
