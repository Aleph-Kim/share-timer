const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.getAdminPage);
router.post('/update-timer', adminController.updateTimer);

module.exports = router;