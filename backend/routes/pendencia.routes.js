/**
 * routes/pendencia.routes.js
 *
 * Define os endpoints da API para o recurso de Pendências.
 * Estas rotas são destinadas à administração e gerenciamento de sugestões
 * de conteúdo pendentes.
 */

const express = require('express');
const router = express.Router();

// Importa o controller e os middlewares.
const pendenciaController = require('../controllers/pendencia.controller');
const { authenticateToken, authorizePerfil } = require('../middlewares/auth.middleware');

// --- Definição das Rotas ---
// Todas as rotas de pendências exigem perfil de 'Admin'.

// Rota para listar todas as pendências.
router.get('/', authenticateToken, authorizePerfil(['Admin']), pendenciaController.listarPendencias);

// Rota para aprovar uma pendência, transformando-a em um documento.
router.post('/:id/aprovar', authenticateToken, authorizePerfil(['Admin']), pendenciaController.aprovarPendencia);

// Rota para excluir (rejeitar) uma pendência.
router.delete('/:id', authenticateToken, authorizePerfil(['Admin']), pendenciaController.excluirPendencia);

module.exports = router;
