const express = require('express');
const authController = require('../controllers/authController');
const userController = require("../controllers/userController");
const uploadImg = require("../utils/libs/multer-for-image");


const router = express.Router()



router.post('/forgotpassword', authController.forgotPassword)

router.post('/signup', authController.signup)
router.post('/login', authController.login)

router.get('/profile', authController.protect, userController.getProfile);
router.post('/updateProfile', uploadImg, authController.protect, userController.updateProfile)

module.exports = router 