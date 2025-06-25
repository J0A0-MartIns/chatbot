/**
 * routes/atendimento_chatbot.routes.js
 *
 * Define os endpoints da API para o recurso de Atendimento do Chatbot.
 */

const express = require('express');
const router = express.Router();

// Importa o controller e os middlewares.
// Assumi que o nome do arquivo do controller é 'atendimento.controller.js'
const atendimentoController = require('../controllers/atendimento.controller');
const { authenticateToken, authorizePerfil } = require('../middlewares/auth.middleware');

// --- Definição das Rotas ---

// Rota para criar um novo atendimento (Qualquer usuário autenticado)
router.post('/', authenticateToken, atendimentoController.criarAtendimento);

// Rota para listar todos os atendimentos (Apenas Admins)
router.get('/', authenticateToken, authorizePerfil(['Admin']), atendimentoController.listarAtendimentos);

// Rota para buscar um atendimento por ID (Apenas Admins)
router.get('/:id', authenticateToken, authorizePerfil(['Admin']), atendimentoController.buscarAtendimentoPorId);

// Rota para atualizar a resposta do chatbot em um atendimento (Apenas Admins)
router.put('/:id/resposta', authenticateToken, authorizePerfil(['Admin']), atendimentoController.atualizarResposta);

// Rota para buscar soluções de um atendimento (Apenas Admins)
router.get('/:id/solucoes', authenticateToken, authorizePerfil(['Admin']), atendimentoController.buscarSolucoesDoAtendimento);

// Rota para adicionar uma solução a um atendimento (Apenas Admins)
router.post('/:id/solucoes', authenticateToken, authorizePerfil(['Admin']), atendimentoController.adicionarSolucaoAoAtendimento);

// Rota para excluir um atendimento (Apenas Admins)
router.delete('/:id', authenticateToken, authorizePerfil(['Admin']), atendimentoController.excluirAtendimento);

module.exports = router;
