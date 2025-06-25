/**
 * routes/dashboard.routes.js
 *
 * Define os endpoints da API para o Dashboard.
 */

const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Rota principal que retorna todas as estatísticas.
// Protegida para garantir que apenas usuários logados possam vê-la.
router.get('/stats', authenticateToken, dashboardController.getStats);

module.exports = router;
