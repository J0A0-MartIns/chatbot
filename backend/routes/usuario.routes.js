/**
 * routes/usuario.routes.js
 */

const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

// Importa os middlewares necessários
const { authenticateToken } = require('../middlewares/auth.middleware');
const { pode } = require('../middlewares/permissao.middleware');

// --- ROTA PÚBLICA ---
// Para um novo utilizador se registar (cria um utilizador pendente)
router.post('/', usuarioController.criarUsuario);


// --- ROTAS AUTENTICADAS ---

// Utilizador troca a própria senha (não precisa de permissão especial)
router.post('/:id/trocar-senha', authenticateToken, usuarioController.trocarSenha);


// --- ROTAS DE ADMINISTRAÇÃO (Exigem Permissões) ---

// Admin cria um utilizador já ativo
router.post('/criar-ativo', authenticateToken, pode('criar_usuario'), usuarioController.criarUsuarioAtivo);

// Rotas para gerir utilizadores pendentes
router.get('/pendentes', authenticateToken, pode('listar_pendencias'), usuarioController.listarPendentes);
router.post('/pendentes/:id/aprovar', authenticateToken, pode('aprovar_pendencia'), usuarioController.aprovarPendente);
router.delete('/pendentes/:id', authenticateToken, pode('rejeitar_pendencia'), usuarioController.rejeitarPendente);

// Rotas para gerir utilizadores ativos
router.get('/', authenticateToken, pode('listar_usuarios'), usuarioController.listarUsuarios);
router.get('/:id', authenticateToken, pode('buscar_usuario_por_id'), usuarioController.buscarUsuarioPorId);
router.put('/:id', authenticateToken, pode('editar_usuario'), usuarioController.atualizarUsuario);
router.delete('/:id', authenticateToken, pode('deletar_usuario'), usuarioController.deletarUsuario);


module.exports = router;
