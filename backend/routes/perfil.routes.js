/**
 * Define os endpoints da API para o recurso de Perfis.
 */

const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfil.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { pode } = require('../middlewares/permissao.middleware');

router.get('/', perfilController.listarPerfis);
router.get('/:id', authenticateToken, pode('gerenciar_perfis'), perfilController.getPerfilById);
router.post('/', authenticateToken, pode('gerenciar_perfis'), perfilController.criarPerfil);
router.put('/:id', authenticateToken, pode('gerenciar_perfis'), perfilController.updatePerfil);
router.delete('/:id', authenticateToken, pode('gerenciar_perfis'), perfilController.deletePerfil);



module.exports = router;
