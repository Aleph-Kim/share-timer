const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.adminLoginPage);
router.post('/', adminController.adminPage);
router.put('/', adminController.updateTimer);

module.exports = router;