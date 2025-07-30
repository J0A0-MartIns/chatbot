/**
 * Define os endpoints da API para o recurso de Perfis.
 */

const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfil.controller');

router.get('/', perfilController.listarPerfis);

module.exports = router;
