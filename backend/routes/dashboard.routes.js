/**
 * Define os endpoints da API para o Dashboard.
 */

const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboard.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { pode } = require('../middlewares/permissao.middleware');

router.get('/stats', authenticateToken, pode('ver_relatorios'), dashboardController.getStats);

module.exports = router;
