const router = require('express').Router()
const passport = require('passport')
const payment = require('../controllers/Payment/paymentController')
const userController = require('../controllers/User/userController')
const { validateAuth } = require('../middleware/validator')
const upload = require('../utils/libs/multer-for-image')


// AUTHENTICATION
// User registration and login
router.post('/register', userController.registerPersonnel)
router.post('/login', userController.loginPersonnel)

// User google authentication routes
router.get('/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}))
router.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    res.status(201).json({ message: "Login with google was successful" })
})

// LinkedIn login and authentication
router.get('/auth/linkedin', passport.authenticate('linkedin', { 
    scope: ['r_emailaddress', 'r_liteprofile']
}))
router.get('/auth/linkedin/redirect', passport.authenticate('linkedin', { failureRedirect: '/' }), (req, res) => {
    res.status(201).json({ message: "User Logged In successfully" })
})


// USER PROFILE
// Get user details
router.get('/profile', validateAuth, userController.getProfile)
// Password update
router.post('/passwordsetting', validateAuth, userController.resetPasswordSetting)
// Profile update
router.post('/updateuserprofile', validateAuth, upload, userController.updateProfile)



// Payment Handler
router.post('/pay', validateAuth, payment.paymentPlatform)

// verify paystack payment
router.get('/paystack/callback', payment.paystackVerify)

// USER LOGOUT
router.get('/logout', (req, res) => res.send("logging out"))

// Forgot password
router.post('/forgotpassword', userController.forgotPassword)


module.exports = router
