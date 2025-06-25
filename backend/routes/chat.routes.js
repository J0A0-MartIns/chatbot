/**
 * routes/chat.routes.js
 *
 * Define os endpoints da API para o Chat.
 */

const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Todas as rotas de chat exigem que o usuário esteja logado.
router.use(authenticateToken);

// Rota para fazer uma pergunta
router.post('/perguntar', chatController.perguntar);

// Rota para dar um feedback
router.post('/feedback', chatController.darFeedback);

module.exports = router;
