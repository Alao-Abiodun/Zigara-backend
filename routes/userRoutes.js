const router = require('express').Router()
const passport = require('passport')


router.get('/', (req, res) => res.send('Hello'))


// User google authentication routes
router.get('/google', passport.authenticate('google', {
    scope: ['email', 'profile']
}))
router.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
    res.status(201).json({ message: "Login with google was successful" })
})

router.get('/google/redirect', (req, res) => {})


// LinkedIn login and authentication
router.get('/auth/linkedin', passport.authenticate('linkedin', {
    scope: ['r_emailaddress', 'r_liteprofile']
}))
// router.get('/auth/linkedin/redirect', passport.authenticate('linkedin', { 
//     failureRedirect: '/',
//     successRedirect: '/dashboard'})
// )

router.get('/auth/linkedin/redirect', passport.authenticate('linkedin', {failureRedirect: '/'}), (req, res) => {
    res.status(201).json({ message: "User Logged In successfully"})
})




router.get('/logout', (req, res) => res.send("logging out"))

module.exports = router