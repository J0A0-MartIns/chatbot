const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/report.controller');

router.get('/', ReportController.gerarRelatorio);

module.exports = router;
