/**
 * routes/auth.routes.js
 *
 * Define os endpoints da API para autenticação.
 */

const express = require('express');
const router = express.Router();

// Importa o controller. A variável 'authController' receberá o objeto exportado.
const authController = require('../controllers/auth.controller');

// A rota chama a função 'login' de dentro do objeto 'authController'.
router.post('/login', authController.login);

module.exports = router;
