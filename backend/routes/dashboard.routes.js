/**
 * Define os endpoints da API para o Dashboard.
 */

const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/permissao.middleware');

router.get('/stats', authenticateToken, isAdmin, dashboardController.getStats);
router.get('/taxa-respostas', authenticateToken, isAdmin, dashboardController.getTaxaRespostas);
router.get('/volume-atendimentos', authenticateToken, isAdmin, dashboardController.getVolumeAtendimentos);

module.exports = router;
