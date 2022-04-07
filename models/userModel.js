const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Firstname can not be empty'],
    },
    lastname: {
        type: String,
        required: [true, 'Lastname can not be empty'],
    },
    email: {
        type: String,
        required: [true, 'Please provide us your email'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please put a valid email']
    },
    password: {
        type: String,
        required: [true, 'Provide a password'],
        select: false
    },
    phonenumber: {
        type: Number,
        required: [true, 'Provide your phone number']
    },
    country: String,
    state: String,
    bio: String,
    profilephoto: String,
    googleId: String,
    linkedIn: String,
    facebookId: String
})

userSchema.pre('save', async function (next) {
    //this will only run if password was mordified
    if (!this.isModified('password')) return next();
    //hash password
    this.password = await bcrypt.hash(this.password, 12);

    next();
});

userSchema.methods.correctPassword = async function (canidatePassword, userPassword) {
    return await bcrypt.compare(canidatePassword, userPassword)
};

const User = mongoose.model('User', userSchema);

module.exports = User; 