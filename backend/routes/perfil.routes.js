const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfil.controller');
const authenticate = require('../middlewares/authMiddleware');


router.post('/', authenticate, perfilController.createPerfil);
router.get('/', authenticate, perfilController.getPerfis);
router.get('/:id', authenticate, perfilController.getPerfilById);
router.put('/:id', authenticate, perfilController.updatePerfil);
router.delete('/:id', authenticate, perfilController.deletePerfil);

module.exports = router;
