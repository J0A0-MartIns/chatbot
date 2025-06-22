const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/sessao.controller');
const autenticar = require('../middlewares/auth.middleware');
const permitir = require('../middlewares/role.middleware');

router.get('/usuario/:id', autenticar, permitir('administrador'), ctrl.listarPorUsuario);
router.post('/logout', autenticar, ctrl.finalizarSessao);

module.exports = router;
