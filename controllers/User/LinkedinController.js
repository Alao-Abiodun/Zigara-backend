const passport = require('passport')
const dotenv = require("dotenv");
dotenv.config();
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy
const User = require('../../models/User/userModel')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }).then((user) => {
        done(null, user)
    })
})

passport.use(new LinkedinStrategy({
    clientID: `${process.env.linkedinClientId}`,
    clientSecret: `${process.env.linkedinClientSecret}`,
    callbackURL: '/auth/linkedin/redirect',
    scope: ['r_emailaddress', 'r_liteprofile']
}, async (accessToken, refreshToken, profile, done) => {
    console.log('Linkedin Callback fired')
    const findUser = await User.findOne({ linkedinId: profile.id })
    if(findUser){
        done(null, findUser)
    }
    const emailResult = profile.emails.map(a => a.value)[0]
    const profilePicture = profile.photos.map(a => a.value)[1]
    const newUser = await User.create({
        firstname: profile.name.givenName,
        lastname: profile.name.familyName,
        email: emailResult,
        password: "",
        phonenumber: "",
        country: "",
        state: "",
        bio: "",
        profilepicture: profilePicture,
        googleId: "",
        linkedinId: profile.id,
        facebookId: ''
    })
    done(null, newUser)

}))