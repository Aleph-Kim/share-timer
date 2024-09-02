const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.adminLoginPage);
router.post('/', adminController.adminPage);
router.put('/', adminController.updateTimer);
router.delete('/', adminController.deleteTimer);

module.exports = router;