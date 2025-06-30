/**
 * routes/tema.routes.js
 *
 * Define os endpoints da API para o recurso de Temas, agora com
 * a segurança de permissões (RBAC) devidamente aplicada e de forma granular.
 */

const express = require('express');
const router = express.Router();

const temaController = require('../controllers/tema.controller');
// Importa os middlewares necessários
const { authenticateToken } = require('../middlewares/auth.middleware');
const { pode } = require('../middlewares/permissao.middleware');

// --- ROTA PÚBLICA (ou apenas autenticada) ---
// Qualquer utilizador logado pode ver a lista de temas para os menus de seleção.
router.get('/', authenticateToken, temaController.listarTemas);


// --- ROTAS DE ADMINISTRAÇÃO (Exigem Permissões Específicas) ---

// CORREÇÃO: A permissão agora é mais específica para cada ação.

// Rota para buscar um tema por ID
router.get('/:id', authenticateToken, pode('ver_categorias'), temaController.buscarTemaPorId);

// Rota para criar um novo tema
router.post('/', authenticateToken, pode('criar_categorias'), temaController.criarTema);

// Rota para atualizar um tema
router.put('/:id', authenticateToken, pode('editar_categorias'), temaController.atualizarTema);

// Rota para remover um tema
router.delete('/:id', authenticateToken, pode('deletar_categorias'), temaController.removerTema);


module.exports = router;
