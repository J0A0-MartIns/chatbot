/**
 * Define os endpoints da API para o recurso de Feedback.
 */

const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const { authenticateToken, authorizePerfil } = require('../middlewares/auth.middleware');


router.post('/', authenticateToken, feedbackController.criarFeedback);
router.get('/', authenticateToken, authorizePerfil(['Admin']), feedbackController.listarFeedbacks);
router.get('/:id', authenticateToken, authorizePerfil(['Admin']), feedbackController.buscarFeedbackPorId);
router.delete('/:id', authenticateToken, authorizePerfil(['Admin']), feedbackController.deletarFeedback);

module.exports = router;
