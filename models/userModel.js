const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    passwordConfirm: {
        type: String,
        validate: {
            validator: function (val) {
                return val === this.password
            },
            message: 'Passwords are not the same'
        }
    },
    phonenumber: Number,
    country: String,
    state: String,
    bio: String,
    profilephoto: String,
    googleId: String,
    linkedIn: String,
    facebookId: String,
    userId: String
})

userSchema.pre('save', async function (next) {
    //this will only run if password was mordified
    if (!this.isModified('password')) return next();
    //hash password
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (canidatePassword, userPassword) {
    return await bcrypt.compare(canidatePassword, userPassword)
};

const User = mongoose.model('User', userSchema);

module.exports = User; 