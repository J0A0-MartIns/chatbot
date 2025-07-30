/**
 * Define os endpoints da API para o recurso de Feedback.
 */

const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/permissao.middleware');


router.post('/', authenticateToken, feedbackController.criarFeedback);
router.get('/', authenticateToken, isAdmin, feedbackController.listarFeedbacks);
router.get('/:id', authenticateToken, isAdmin, feedbackController.buscarFeedbackPorId);
router.delete('/:id', authenticateToken, isAdmin, feedbackController.deletarFeedback);

module.exports = router;
