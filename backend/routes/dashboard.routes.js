/**
 * Define os endpoints da API para o Dashboard.
 */

const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { pode } = require('../middlewares/permissao.middleware');

router.get('/stats', authenticateToken, pode('ver_relatorios'), dashboardController.getStats);
router.get('/taxa-respostas', authenticateToken, pode('ver_relatorios'), dashboardController.getTaxaRespostas);
router.get('/volume-atendimentos', authenticateToken, pode('ver_relatorios'), dashboardController.getVolumeAtendimentos);

module.exports = router;
