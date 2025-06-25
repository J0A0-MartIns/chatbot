/**
 * routes/base_conhecimento.routes.js
 *
 * Define os endpoints da API para o recurso da Base de Conhecimento.
 */

const express = require('express');
const router = express.Router();

// Importa o controller e os middlewares.
const baseConhecimentoController = require('../controllers/base_conhecimento.controller');
const { authenticateToken, authorizePerfil } = require('../middlewares/auth.middleware');

// --- Definição das Rotas ---

// Rota para criar um documento (Qualquer usuário autenticado)
router.post('/', authenticateToken, baseConhecimentoController.criarDocumento);

// Rota para listar todos os documentos (Qualquer usuário autenticado)
router.get('/', authenticateToken, baseConhecimentoController.listarDocumentos);

// Rota para buscar documentos por subtema (Qualquer usuário autenticado)
// Corrigido de '/microtema/:microtemaId' para um padrão mais limpo.
router.get('/subtema/:id_subtema', authenticateToken, baseConhecimentoController.buscarPorSubtema);

// Rota para buscar um documento por ID (Qualquer usuário autenticado)
router.get('/:id', authenticateToken, baseConhecimentoController.buscarDocumentoPorId);

// Rota para atualizar um documento (Apenas Admins)
router.put('/:id', authenticateToken, authorizePerfil(['Admin']), baseConhecimentoController.atualizarDocumento);

// Rota para ativar/desativar um documento (Apenas Admins)
router.patch('/:id/ativo', authenticateToken, authorizePerfil(['Admin']), baseConhecimentoController.atualizarAtivo);

// Rota para excluir um documento (Apenas Admins)
router.delete('/:id', authenticateToken, authorizePerfil(['Admin']), baseConhecimentoController.excluirDocumento);

module.exports = router;
