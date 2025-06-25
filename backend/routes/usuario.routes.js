const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

router.post('/', usuarioController.criarUsuario);
router.get('/', authenticateToken, usuarioController.listarUsuarios);
router.get('/:id', authenticateToken, usuarioController.buscarUsuarioPorId);
router.put('/:id', authenticateToken, usuarioController.atualizarUsuario);
router.delete('/:id', authenticateToken, usuarioController.deletarUsuario);
router.get('/pendentes', authenticateToken, pode('listar_usuarios'), usuarioController.listarPendentes);
router.post('/pendentes/:id/aprovar', authenticateToken, pode('editar_usuario'), usuarioController.aprovarPendente);
router.delete('/pendentes/:id', authenticateToken, pode('editar_usuario'), usuarioController.rejeitarPendente);
router.post('/:id/trocar-senha', usuarioController.trocarSenha);

module.exports = router;