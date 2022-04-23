const User = require('./../models/userModel');
const catchAsync = require('../utils/libs/catchAsync')
const AppError = require('../utils/libs/appError');
const response = require('../utils/libs/response.js');
const { cloudinary } = require('../utils/libs/cloudinaryUpload');

exports.getProfile = catchAsync(async (req, res) => {
    // console.log('hello twitter')
    const user = req.user
    if (!user) return response.errorResMsg(res, 400, { message: "User not found" })
    const findUser = await User.findById(user._id)
    if (!findUser) return response.errorResMsg(res, 400, { message: "Couldn't find user" })
    // const getUser = await User.findOne({ _id: user._id })
    return response.successResMsg(res, 200, { data: findUser })
})


exports.updateProfile = catchAsync(async (req, res) => {
    console.log("That route")
    // const data = req.file.path
    // const user = req.user

    const findUser = await User.findById(user._id)
    if (!findUser) return response.errorResMsg(res, 400, { message: "User profile not found" })
    const { firstName, lastName, phoneNumber, country, state, bio } = req.body
    console.log(data)
    const uploadedResponse = await cloudinary.uploader.upload(data, {
        upload_preset: 'ml_default'
    });
    console.log(uploadedResponse);
    await User.updateOne({ _id: findUser._id }, {
        firstname: firstName,
        lastname: lastName,
        phonenumber: phoneNumber,
        country,
        state,
        bio,
        profilepicture: uploadedResponse.secure_url

    })
    return response.successResMsg(res, 201, { message: "User profile has been updated successfully" })
})