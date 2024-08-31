const express = require('express');
const router = express.Router();
const timerController = require('../controllers/timerController');

router.get('/', timerController.getTimerPage);

module.exports = router;