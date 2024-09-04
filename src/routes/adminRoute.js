const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.adminLoginPage);
router.post('/', adminController.adminPage);
router.put('/', adminController.updateTimer);
router.delete('/', adminController.deleteTimer);
router.put('/pause', adminController.pauseTimer);
router.put('/resume', adminController.resumeTimer);

module.exports = router;