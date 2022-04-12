const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const catchAsync = require('../utils/libs/catchAsync')
const AppError = require('../utils/libs/appError');
const signToken = require('../utils/libs/jwt-helper');

dotenv.config({ path: './config.env' });

exports.signup = catchAsync(async (req, res, next) => {

    const newUser = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        phonenumber: req.body.phonenumber
    })


    const token = signToken.signAccessToken({ id: newUser._id })

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
});

exports.login = catchAsync(async (req, res, next) => {
    //payload from body
    const { email, password } = req.body
    //check if empty
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    //select user with same email
    const user = await User.findOne({ email: email }).select('+password');
    //check is there is a user and the password is correct
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 400))
    }
    //asign a token
    const token = signToken.signAccessToken({ id: user._id });

    //send response
    res.status(200).json({
        status: 'success',
        token
    })
})

exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1) get user based on email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return next(new AppError("There is no user with that email address", 404));
    }
    //2)generate random token and send back as email

    res.status(200).json({
        status: 'success',
        message: "A password reset mail have been set to you"
    })
})
