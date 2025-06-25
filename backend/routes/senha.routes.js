/**
 * routes/senha.routes.js
 * (Anteriormente password.routes.js)
 *
 * Define os endpoints da API para recuperação de senha.
 */

const express = require('express');
const router = express.Router();

// --- CORREÇÃO ---
// Garante que estamos a importar do ficheiro com o nome correto: 'senha.controller.js'
const passwordController = require('../controllers/senha.controller');

// Rota para solicitar o link de recuperação
router.post('/forgot', passwordController.forgotPassword);

// Rota para redefinir a senha com o token
router.post('/reset/:token', passwordController.resetPassword);

module.exports = router;
