/**
 * Define os endpoints da API para o recurso de Atendimento do Chatbot.
 */

const express = require('express');
const router = express.Router();
const atendimentoController = require('../controllers/atendimento.controller');
const { authenticateToken, authorizePerfil } = require('../middlewares/auth.middleware');


router.post('/', authenticateToken, atendimentoController.criarAtendimento);
router.get('/', authenticateToken, authorizePerfil(['Admin']), atendimentoController.listarAtendimentos);
router.get('/:id', authenticateToken, authorizePerfil(['Admin']), atendimentoController.buscarAtendimentoPorId);
router.put('/:id/resposta', authenticateToken, authorizePerfil(['Admin']), atendimentoController.atualizarResposta);
router.get('/:id/solucoes', authenticateToken, authorizePerfil(['Admin']), atendimentoController.buscarSolucoesDoAtendimento);
router.post('/:id/solucoes', authenticateToken, authorizePerfil(['Admin']), atendimentoController.adicionarSolucaoAoAtendimento);
router.delete('/:id', authenticateToken, authorizePerfil(['Admin']), atendimentoController.excluirAtendimento);

module.exports = router;
