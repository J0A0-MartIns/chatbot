/**
 * routes/sub_tema.routes.js
 *
 * Define os endpoints da API para o recurso de Subtemas.
 */

const express = require('express');
const router = express.Router();

// Importa o controller com a lógica de negócio.
const subTemaController = require('../controllers/sub_tema.controller');

// Importa os middlewares de forma correta, usando desestruturação.
const { authenticateToken, authorizePerfil } = require('../middlewares/auth.middleware');

// --- Definição das Rotas ---

// Rota para criar um novo subtema (Apenas Admins)
router.post('/', authenticateToken, authorizePerfil(['Admin']), subTemaController.criarSubtema);

// Rota para listar todos os subtemas (Qualquer usuário autenticado)
router.get('/', authenticateToken, subTemaController.listarSubtemas);

// Rota para listar todos os subtemas de um tema específico
router.get('/tema/:id_tema', authenticateToken, subTemaController.listarPorTema);

// Rota para buscar um subtema por ID (Qualquer usuário autenticado)
router.get('/:id', authenticateToken, subTemaController.buscarSubtemaPorId);

// Rota para atualizar um subtema (Apenas Admins)
router.put('/:id', authenticateToken, authorizePerfil(['Admin']), subTemaController.atualizarSubtema);

// Rota para remover um subtema (Apenas Admins)
router.delete('/:id', authenticateToken, authorizePerfil(['Admin']), subTemaController.removerSubtema);

module.exports = router;
