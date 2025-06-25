/**
 * routes/base_conhecimento.routes.js
 *
 * Define os endpoints da API para o recurso da Base de Conhecimento.
 */

const express = require('express');
const router = express.Router();

// Importa o controller e os middlewares.
const baseConhecimentoController = require('../controllers/base_conhecimento.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');
const { pode } = require('../middlewares/permissao.middleware');

// --- Definição das Rotas ---

// Rota para criar um documento (Requer permissão 'criar_documento')
router.post('/', authenticateToken, pode('criar_documento'), baseConhecimentoController.criarDocumento);

// Rota para listar todos os documentos (Apenas autenticado, sem permissão especial)
router.get('/', authenticateToken, baseConhecimentoController.listarDocumentos);

// Rota para buscar documentos por subtema
router.get('/subtema/:id_subtema', authenticateToken, baseConhecimentoController.buscarPorSubtema);

// Rota para buscar um documento por ID
router.get('/:id', authenticateToken, baseConhecimentoController.buscarDocumentoPorId);

// Rota para atualizar um documento (Requer permissão 'editar_documento')
router.put('/:id', authenticateToken, pode('editar_documento'), baseConhecimentoController.atualizarDocumento);

// Rota para ativar/desativar um documento (Requer permissão 'publicar_documento')
router.patch('/:id/ativo', authenticateToken, pode('publicar_documento'), baseConhecimentoController.atualizarAtivo);

// Rota para excluir um documento (Requer permissão 'deletar_documento')
router.delete('/:id', authenticateToken, pode('deletar_documento'), baseConhecimentoController.excluirDocumento);

module.exports = router;
