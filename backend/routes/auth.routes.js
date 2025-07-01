/**
 * Define os endpoints da API para autenticação, incluindo login e logout.
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');


router.post('/login', authController.login);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
