/**
 * Define os endpoints da API para recuperação de senha.
 */

const express = require('express');
const router = express.Router();
const senhaController = require('../controllers/senha.controller');


router.post('/forgot', senhaController.forgotPassword);
router.post('/reset/:token', senhaController.resetPassword);

module.exports = router;
