/**
 * routes/perfil.routes.js
 *
 * Este arquivo define os endpoints da API para o recurso de Perfis.
 * Ele associa cada rota HTTP a uma função do controller correspondente e aplica
 * middlewares de autenticação e autorização quando necessário.
 */

const express = require('express');
const router = express.Router();

// Importa o controller com a lógica de negócio.
const perfilController = require('../controllers/perfil.controller');

// Importa os middlewares de autenticação e autorização.
// Usamos a desestruturação para pegar as funções que precisamos.
const { authenticateToken, authorizePerfil } = require('../middlewares/auth.middleware');

// --- Definição das Rotas ---

// Rota para criar um novo perfil.
// Apenas usuários autenticados e com perfil 'Admin' podem criar perfis.
router.post('/', authenticateToken, authorizePerfil(['Admin']), perfilController.criarPerfil);

// --- ROTA PÚBLICA ---
// CORREÇÃO: Esta rota agora é PÚBLICA para permitir que a tela de cadastro
// busque a lista de perfis disponíveis para seleção.
router.get('/', perfilController.listarPerfis);

// Rota para buscar um perfil específico pelo ID.
// Apenas usuários autenticados podem buscar um perfil.
router.get('/:id', authenticateToken, perfilController.getPerfilById);

// Rota para atualizar um perfil.
// Apenas usuários autenticados e com perfil 'Admin' podem atualizar.
router.put('/:id', authenticateToken, authorizePerfil(['Admin']), perfilController.updatePerfil);

// Rota para deletar um perfil.
// Apenas usuários autenticados e com perfil 'Admin' podem deletar.
router.delete('/:id', authenticateToken, authorizePerfil(['Admin']), perfilController.deletePerfil);


module.exports = router;
