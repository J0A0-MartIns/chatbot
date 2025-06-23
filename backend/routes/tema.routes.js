const express = require('express');
const router = express.Router();
const temaController = require('../controllers/tema.controller');
const authenticate = require('../middlewares/authMiddleware');

router.post('/', authenticate, temaController.create);
router.get('/', authenticate, temaController.findAll);
router.get('/:id', authenticate, temaController.findById);
router.put('/:id', authenticate, temaController.update);
router.delete('/:id', authenticate, temaController.remove);

module.exports = router;
