const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.post('/userSignup',authController.userSignup);
router.post('/userLogin', authController.userLogin);
router.post('/reset_password', authController.resetPassword)
router.post('/new_password', authController.newPassword)


module.exports = router;


