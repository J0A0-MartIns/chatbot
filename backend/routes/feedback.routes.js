/**
 * Define os endpoints da API para o recurso de Feedback.
 */

const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { pode } = require('../middlewares/permissao.middleware');


router.post('/', authenticateToken, feedbackController.criarFeedback);
router.get('/', authenticateToken, pode('listar_feedbacks'), feedbackController.listarFeedbacks);
router.get('/:id', authenticateToken, pode('listar_feedbacks'), feedbackController.buscarFeedbackPorId);
router.delete('/:id', authenticateToken, pode('rejeitar_pendencia'), feedbackController.deletarFeedback);

module.exports = router;
