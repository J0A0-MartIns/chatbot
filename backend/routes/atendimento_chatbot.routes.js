// /**
//  * Define os endpoints da API para o recurso de Atendimento do Chatbot.
//  */
//
// const express = require('express');
// const router = express.Router();
// const atendimentoController = require('../controllers/atendimento.controller');
// const { authenticateToken } = require('../middlewares/auth.middleware');
// const { pode } = require('../middlewares/permissao.middleware');
//
//
// router.get('/', authenticateToken, pode('listar_atendimentos'), atendimentoController.listarAtendimentos);
// router.get('/:id', authenticateToken, pode('listar_atendimentos'), atendimentoController.buscarAtendimentoPorId);
// router.get('/:id/solucoes', authenticateToken, pode('listar_atendimentos'), atendimentoController.buscarSolucoesDoAtendimento);
// router.post('/', authenticateToken, pode('gerenciar_perfis'), atendimentoController.criarAtendimento);
// router.put('/:id/resposta', authenticateToken, pode('gerenciar_perfis'), atendimentoController.atualizarResposta);
// router.post('/:id/solucoes', authenticateToken, pode('gerenciar_perfis'), atendimentoController.adicionarSolucaoAoAtendimento);
// router.delete('/:id', authenticateToken, pode('gerenciar_perfis'), atendimentoController.excluirAtendimento);
//
// module.exports = router;
//Revisar para implantação futura....