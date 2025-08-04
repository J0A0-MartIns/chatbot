const express = require('express');
const router = express.Router();

const usuarioRoutes = require('./usuario.routes');
const perfilRoutes = require('./perfil.routes');
const temaRoutes = require('./tema.routes');
const subTemaRoutes = require('./sub_tema.routes');
const baseConhecimentoRoutes = require('./base_conhecimento.routes');
const pendenciaRoutes = require('./pendencia.routes');
const documentoArquivoRoutes = require('./documento_arquivo.routes');
const authRoutes = require('./auth.routes');
const dashboardRoutes = require('./dashboard.routes');
const relatorioRoutes = require('./relatorio.routes');
const chatRoutes = require('./chat.routes');
const passwordRoutes = require('./senha.routes');

router.use('/usuarios', usuarioRoutes);
router.use('/perfis', perfilRoutes);
router.use('/temas', temaRoutes);
router.use('/subtemas', subTemaRoutes);
router.use('/base', baseConhecimentoRoutes);
router.use('/pendencias', pendenciaRoutes);
router.use('/base-conhecimento', baseConhecimentoRoutes);
router.use('/arquivo', documentoArquivoRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/relatorios', relatorioRoutes);
router.use('/chat', chatRoutes);
router.use('/senha', passwordRoutes);



module.exports = router;