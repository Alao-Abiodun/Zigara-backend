const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const catchAsync = require('../utils/libs/catchAsync')
const AppError = require('../utils/libs/appError');
const signToken = require('../utils/libs/jwt-helper');

dotenv.config({ path: './config.env' });

exports.signup = catchAsync(async (req, res, next) => {

    // const newUser = await User.create(req.body);
    const newUser = await User.create({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        phonenumber: req.body.phonenumber,
        country: req.body.country,
        state: req.body.state
    })

    console.log(newUser)
    const token = signToken.signAccessToken({ id: newUser._id })

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    })
});
