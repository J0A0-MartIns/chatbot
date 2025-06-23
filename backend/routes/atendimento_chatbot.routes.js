// routes/atendimento_chatbot.routes.js
const express = require('express');
const router = express.Router();
const atendimentoController = require('../controllers/atendimento.controller');


router.post('/', atendimentoController.criarAtendimento);
router.get('/', atendimentoController.listarAtendimentos);
router.get('/:id', atendimentoController.buscarAtendimentoPorId);
router.put('/:id/resposta', atendimentoController.atualizarResposta);
router.delete('/:id', atendimentoController.excluirAtendimento);
router.get('/:id/solucoes', atendimentoController.buscarSolucoesDoAtendimento);
router.post('/:id/solucoes', atendimentoController.adicionarSolucaoAoAtendimento);

module.exports = router;
