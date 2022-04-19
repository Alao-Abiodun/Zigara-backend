const router = require('express').Router()
const passport = require('passport')
const userController = require('../controllers/User/userController')
const { validateAuth } = require('../middleware/validator')

// AUTHENTICATION
// User registration and login
router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)

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
// router.get('/profile', validateAuth, userController.getProfile)
router.get('/profile/:id', userController.getProfile)
// Password update
router.post('/passwordsetting', validateAuth, userController.resetPasswordSetting)

// Profile update
// router.post('/updateprofile', validateAuth, userController.updateProfile)
router.post('/updateprofile', userController.updateProfile)


router.get('/logout', (req, res) => res.send("logging out"))


module.exports = router 