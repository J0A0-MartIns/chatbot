/**
 * routes/auth.routes.js
 *
 * Define os endpoints da API para autenticação, incluindo login e logout.
 */

const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
// --- CORREÇÃO: Importa o middleware de autenticação ---
const { authenticateToken } = require('../middlewares/auth.middleware');

// Rota para autenticar um utilizador e criar uma sessão
router.post('/login', authController.login);

// Rota para finalizar a sessão ativa de um utilizador.
// Ela é protegida para garantir que apenas um utilizador logado possa fazer logout.
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
