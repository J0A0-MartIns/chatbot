/**
 * Define as rotas para API de gerência de usuários.
 */

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/permissao.middleware');


router.post('/', usuarioController.criarUsuario);


router.post('/:id/trocar-senha', authenticateToken, usuarioController.trocarSenha);
router.post('/criar-ativo', authenticateToken, isAdmin, usuarioController.criarUsuarioAtivo);
router.get('/pendentes', authenticateToken, isAdmin, usuarioController.listarPendentes);
router.post('/pendentes/:id/aprovar', authenticateToken, isAdmin, usuarioController.aprovarPendente);
router.delete('/pendentes/:id', authenticateToken, isAdmin, usuarioController.rejeitarPendente);
router.get('/', authenticateToken, isAdmin, usuarioController.listarUsuarios);
router.put('/:id', authenticateToken, isAdmin, usuarioController.atualizarUsuario);
router.delete('/:id', authenticateToken, isAdmin, usuarioController.deletarUsuario);


module.exports = router;
