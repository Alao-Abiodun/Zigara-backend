const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy
const User = require('../../models/User/userModel')
const uuid = require('uuid')

passport.serializeUser((user, done) => {
    done(null, user.userId)
})

passport.deserializeUser((id, done) => {
    User.findOne({ userId: id }).then((user) => {
        done(null, user)
    })
})

passport.use(
    new GoogleStrategy({
        clientID: `${process.env.googleClientId}`,
        clientSecret: `${process.env.googleClientSecret}`,
        callbackURL: `/auth/google/redirect`,
        scope: ['email', 'profile']
    }, async (accessToken, refreshToken, profile, done) => {
        console.log("Google Call back fired")
        console.log(profile)
        const findUser = await User.findOne({ googleId: profile.id })
        if(findUser){
            done(null, findUser)
        }
        else{
            const newUser = User.create({
                firstname: profile.name.givenName,
                lastname: profile.name.familyName,
                email: "",
                password: "",
                phonenumber: "",
                country: "",
                state: "",
                bio: "",
                // profilepicture: profile._json.image.url,
                profilepicture: profile.coverPhoto,
                googleId: profile.id,
                linkedinId: "",
                facebookId: '',
                userId: uuid.v4()
            })
            done(null, newUser)
        }
    }
)) 