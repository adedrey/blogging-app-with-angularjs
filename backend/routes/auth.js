const express = require('express');
const authController = require('../controller/auth');
const router = express.Router();

router.post('/api/signup', authController.postAddUser);
router.post('/api/login', authController.getUser);

module.exports = router;