const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/chatbot.controller');
const autenticar = require('../middlewares/auth.middleware');

router.post('/perguntar', autenticar, ctrl.perguntar);
router.post('/feedback', autenticar, ctrl.enviarFeedback);

module.exports = router;
