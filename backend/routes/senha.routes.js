/**
 * Define os endpoints da API para recuperação de senha.
 */

const express = require('express');
const router = express.Router();
const passwordController = require('../controllers/senha.controller');


router.post('/forgot', passwordController.forgotPassword);
router.post('/reset/:token', passwordController.resetPassword);

module.exports = router;
