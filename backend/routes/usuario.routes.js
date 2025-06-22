const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usuario.controller');
const autenticar = require('../middlewares/auth.middleware');
const permitir = require('../middlewares/role.middleware');

router.get('/', autenticar, permitir('administrador'), ctrl.listarTodos);
router.get('/pendentes', autenticar, permitir('administrador'), ctrl.listarPendentes);
router.put('/aprovar/:id', autenticar, permitir('administrador'), ctrl.aprovar);
router.delete('/rejeitar/:id', autenticar, permitir('administrador'), ctrl.rejeitar);

router.get('/:id', autenticar, ctrl.buscar);
router.put('/:id', autenticar, ctrl.atualizar);
router.delete('/:id', autenticar, ctrl.deletar);

module.exports = router;
