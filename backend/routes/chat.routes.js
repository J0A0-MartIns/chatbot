/**
 * Define os endpoints da API para o Chat.
 */

const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chat.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.use(authenticateToken);
router.post('/perguntar', chatController.perguntar);
router.post('/feedback', chatController.darFeedback);
router.post('/pendencia', chatController.criarPendenciaDireta);

module.exports = router;
