const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const catchAsync = require('../utils/libs/catchAsync')
const AppError = require('../utils/libs/appError');
const signToken = require('../utils/libs/jwt-helper');
const response = require('../utils/libs/response.js');

dotenv.config({ path: './config.env' });

exports.signup = catchAsync(async (req, res, next) => {

    const newUser = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        phonenumber: req.body.phonenumber,
        country: "",
        state: "",
        bio: "",
        profilepicture: "",
        googleId: "",
        linkedinId: "",
        facebookId: ""
    })


    const token = signToken.signAccessToken({ id: newUser._id })
    const msg = {
        message: token,
        data: newUser
    }
    response.successResMsg(res, 201, msg)
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
    const msg = {
        message: 'login token',
        data: token
    }
    response.successResMsg(res, 200, msg);
    // res.status(200).json()
})


exports.protect = catchAsync(async (req, res, next) => {
    console.log("this route")
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    //1)check if token was sent in the first place
    if (!token) {
        return next(new AppError('You are not logged in', 401))
    }
    //2)verify jwt token
    const decoded = await promisify(jwt.verify)(token, process.env.ZIGARA_ACCESS_TOKEN_SECRET);

    //3)check if user actually exists
    const freshUser = await User.findById(decoded.id)

    if (!freshUser) {
        return next(new AppError('User no longer exist', 401))
    }

    //greant access to protected routes
    req.user = freshUser
    next()
})


exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1) get user based on email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        message = "There is no user with that email address"
        return next(new AppError(response.errorResMsg(res, 404, message)));
    }
    //2)generate random token and send back as email
    const msg = {
        message: "A password reset mail have been set to you",
        data: null
    };
    response.successResMsg(res, 200, msg)
})
