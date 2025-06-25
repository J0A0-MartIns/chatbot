/**
 * routes/sub_tema.routes.js
 *
 * Define os endpoints da API para o recurso de Subtemas.
 */

const express = require('express');
const router = express.Router();

const subTemaController = require('../controllers/sub_tema.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { pode } = require('../middlewares/permissao.middleware');

// --- Definição das Rotas ---

// Rota para criar um novo subtema (Requer permissão de 'gerenciar_categorias')
router.post('/', authenticateToken, pode('gerenciar_categorias'), subTemaController.criarSubtema);

// Rota para listar todos os subtemas (Qualquer usuário autenticado)
router.get('/', authenticateToken, subTemaController.listarSubtemas);

// Rota para listar todos os subtemas de um tema específico
router.get('/tema/:id_tema', authenticateToken, subTemaController.listarPorTema);

// Rota para buscar um subtema por ID
router.get('/:id', authenticateToken, subTemaController.buscarSubtemaPorId);

// Rota para atualizar um subtema
router.put('/:id', authenticateToken, pode('gerenciar_categorias'), subTemaController.atualizarSubtema);

// Rota para remover um subtema
router.delete('/:id', authenticateToken, pode('gerenciar_categorias'), subTemaController.removerSubtema);

module.exports = router;
