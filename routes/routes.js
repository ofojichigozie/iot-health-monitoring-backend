const express = require('express');
const controller = require('../controllers/controller');
const util = require('../utils/util');

const router = express.Router();

router.post('/login', controller.login);
router.get('/health-records', util.verifyJwtToken, controller.getHealthRecords);
router.get('/health-records/:patientID/:temperature/:humidity/:pulseRate', controller.addHealthRecord);
router.delete('/health-records ', util.verifyJwtToken, controller.deleteRecords);

module.exports = router;