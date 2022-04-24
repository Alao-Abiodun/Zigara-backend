const mongoose = require('mongoose')
const schema = mongoose.Schema

const userSchema = new schema({
    firstname: String,
    lastname: String,
    email: String,
    role: String,
    password: String,
    phonenumber: Number,
    role: String,
    country: String,
    state: String,
    bio: String,
    profilepicture: String,
    googleId: String, 
    linkedinId: String,
    facebookId: String
})

const User = mongoose.model('user', userSchema)
module.exports = User