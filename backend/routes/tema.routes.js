/**
 * routes/tema.routes.js
 *
 * Define os endpoints da API para o recurso de Temas.
 */

const express = require('express');
const router = express.Router();

// Importa o controller com a lógica de negócio.
const temaController = require('../controllers/tema.controller');

// Importa os middlewares de forma correta, usando desestruturação.
const { authenticateToken, authorizePerfil } = require('../middlewares/auth.middleware');

// --- Definição das Rotas ---

// Rota para criar um novo tema (Apenas Admins)
router.post('/', authenticateToken, authorizePerfil(['Admin']), temaController.criarTema);

// Rota para listar todos os temas (Qualquer usuário autenticado)
router.get('/', authenticateToken, temaController.listarTemas);

// Rota para buscar um tema por ID (Qualquer usuário autenticado)
router.get('/:id', authenticateToken, temaController.buscarTemaPorId);

// Rota para atualizar um tema (Apenas Admins)
router.put('/:id', authenticateToken, authorizePerfil(['Admin']), temaController.atualizarTema);

// Rota para remover um tema (Apenas Admins)
router.delete('/:id', authenticateToken, authorizePerfil(['Admin']), temaController.removerTema);

module.exports = router;
