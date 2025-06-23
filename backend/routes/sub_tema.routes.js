const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authMiddleware');
const subTemaController = require('../controllers/sub_tema.controller');

router.use(authenticate);

router.get('/', subTemaController.getAll);
router.get('/:id', subTemaController.getById);
router.get('/tema/:macrotema_id_macrotema', subTemaController.getByMacrotemaId);
router.post('/', subTemaController.create);
router.put('/:id', subTemaController.update);
router.delete('/:id', subTemaController.remove);

module.exports = router;
