const express = require('express');
const router = express.Router();

const usuarioRoutes = require('./usuario.routes');
const perfilRoutes = require('./perfil.routes');
const sessaoRoutes = require('./sessao.routes');
const temaRoutes = require('./tema.routes');
const subTemaRoutes = require('./sub_tema.routes');
const baseConhecimentoRoutes = require('./base_conhecimento.routes');
const atendimentoRoutes = require('./atendimento_chatbot.routes');
//const solucaoRoutes = require('./solucao.routes');
const feedbackRoutes = require('./feedback.routes');
const pendenciaRoutes = require('./pendencia.routes');

router.use('/usuarios', usuarioRoutes);
router.use('/perfis', perfilRoutes);
router.use('/sessoes', sessaoRoutes);
router.use('/tema', temaRoutes);
router.use('/subtema', subTemaRoutes);
router.use('/base', baseConhecimentoRoutes);
router.use('/atendimentos', atendimentoRoutes);
//router.use('/solucoes', solucaoRoutes);
router.use('/feedbacks', feedbackRoutes);
router.use('/pendencias', pendenciaRoutes);

module.exports = router;