const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/', usuarioController.criarUsuario);
router.get('/', authMiddleware, usuarioController.listarUsuarios);
router.get('/:id', authMiddleware, usuarioController.buscarUsuarioPorId);
router.put('/:id', authMiddleware, usuarioController.atualizarUsuario);
router.delete('/:id', authMiddleware, usuarioController.deletarUsuario);

module.exports = router;