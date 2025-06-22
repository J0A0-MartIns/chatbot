const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/dashboard.controller');
const autenticar = require('../middlewares/auth.middleware');
const permitir = require('../middlewares/role.middleware');

router.get('/', autenticar, permitir('administrador'), ctrl.resumoGeral);

module.exports = router;
