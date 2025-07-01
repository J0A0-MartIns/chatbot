/**
 * Define os endpoints da API para o recurso de Perfis.
 * Associa cada rota HTTP a uma função do controller correspondente e aplica
 * middlewares de autenticação e autorização quando necessário.
 */

const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfil.controller');
const { authenticateToken, authorizePerfil } = require('../middlewares/auth.middleware');

router.post('/', authenticateToken, authorizePerfil(['Admin']), perfilController.criarPerfil);
router.get('/', perfilController.listarPerfis);
router.get('/:id', authenticateToken, perfilController.getPerfilById);
router.put('/:id', authenticateToken, authorizePerfil(['Admin']), perfilController.updatePerfil);
router.delete('/:id', authenticateToken, authorizePerfil(['Admin']), perfilController.deletePerfil);


module.exports = router;
