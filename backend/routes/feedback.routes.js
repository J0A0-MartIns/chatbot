/**
 * routes/feedback.routes.js
 *
 * Define os endpoints da API para o recurso de Feedback.
 */

const express = require('express');
const router = express.Router();

// Importa o controller e os middlewares.
const feedbackController = require('../controllers/feedback.controller');
const { authenticateToken, authorizePerfil } = require('../middlewares/auth.middleware');

// --- Definição das Rotas ---

// Rota para um usuário criar um novo feedback (Qualquer usuário autenticado)
router.post('/', authenticateToken, feedbackController.criarFeedback);

// Rota para listar todos os feedbacks (Apenas Admins)
router.get('/', authenticateToken, authorizePerfil(['Admin']), feedbackController.listarFeedbacks);

// Rota para buscar um feedback por ID (Apenas Admins)
router.get('/:id', authenticateToken, authorizePerfil(['Admin']), feedbackController.buscarFeedbackPorId);

// Rota para deletar um feedback (Apenas Admins)
router.delete('/:id', authenticateToken, authorizePerfil(['Admin']), feedbackController.deletarFeedback);


module.exports = router;
