const express = require('express');
const authController = require('../controllers/authController');


const router = express.Router()

router.post('/signup', async (req, res, next) => {
    await authController.signup(req, res, next)
    // console.log("Wetin dey happen")
})
// router.post('/login', authController.login)


module.exports = router