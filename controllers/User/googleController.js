const passport = require('passport')
const dotenv = require("dotenv");
dotenv.config();
const GoogleStrategy = require('passport-google-oauth2').Strategy
const User = require('../../models/User/userModel')

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }).then((user) => {
        done(null, user)
    })
})

passport.use(
    new GoogleStrategy({
        clientID: `${process.env.googleClientId}`,
        clientSecret: `${process.env.googleClientSecret}`,
        callbackURL: `${process.env.googleCallbackURL}`,
        scope: ['email', 'profile']
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("Google Call back fired")
        console.log(profile)
        const findUser = await User.findOne({ googleId: profile.id })
        if(findUser){
            console.log(`Find user ${findUser}`)
            done(null, findUser)
        }
        else{
            const newUser = User.create({
                firstname: profile.name.givenName,
                lastname: profile.name.familyName,
                email: profile._json.email,
                password: "",
                phonenumber: "",
                country: "",
                state: "",
                bio: "",
                profilepicture: profile._json.picture,
                googleId: profile.id,
                linkedinId: "",
                facebookId: ''
            })
            console.log(`New User ${newUser}`)
            done(null, newUser)
        }
    }
)) 