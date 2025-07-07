/**
 * Define as rotas para API de gerência de usuários.
 */

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { pode } = require('../middlewares/permissao.middleware');


router.post('/', usuarioController.criarUsuario);


router.post('/:id/trocar-senha', authenticateToken, usuarioController.trocarSenha);
router.post('/criar-ativo', authenticateToken, pode('criar_usuario'), usuarioController.criarUsuarioAtivo);
router.get('/pendentes', authenticateToken, pode('listar_pendencias'), usuarioController.listarPendentes);
router.post('/pendentes/:id/aprovar', authenticateToken, pode('aprovar_pendencia'), usuarioController.aprovarPendente);
router.delete('/pendentes/:id', authenticateToken, pode('rejeitar_pendencia'), usuarioController.rejeitarPendente);
router.get('/', authenticateToken, pode('listar_usuarios'), usuarioController.listarUsuarios);
//router.get('/:id', authenticateToken, pode('buscar_usuario_por_id'), usuarioController.buscarUsuarioPorId);
router.put('/:id', authenticateToken, pode('editar_usuario'), usuarioController.atualizarUsuario);
router.delete('/:id', authenticateToken, pode('deletar_usuario'), usuarioController.deletarUsuario);


module.exports = router;
