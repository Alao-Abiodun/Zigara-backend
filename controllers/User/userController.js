const validateUser = require('../../utils/validations/index')
const bcrypt = require('bcryptjs')
const User = require('../../models/User/userModel')
const Admin = require('../../models/User/adminModel')
const response = require('../../utils/libs/response')
const Joi = require('joi')
const Roles = require("../../middleware/role")
const jwt = require('jsonwebtoken')

// Register Validation schema
const registrationSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone: Joi.number().required()
})

// Validate user/admin
function emailCheck(email, role) {
    var regExp = new RegExp("[a-z0-9\.-_]*@zigara\.com$", "i");
    match = email.match(regExp);
    if(match){
        role = Roles.Admin
    }
    else{
        role = Roles.User
    }
}

// login Validation schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8)
})

// token
const createToken = async (payload) => {
    return jwt.sign(payload, `${process.env.cookieKey}`, {
        expiresIn: 6 * 60 * 60
    })
}

// Authentication
const registerPersonnel = async (req, res) => {
    validateUser(registrationSchema)
    let userRole;
    emailCheck(req.body.email, userRole)
    if(userRole === Roles.User){
        const userExist = await User.findOne({ email: req.body.email })
        if (userExist) return response.errorResMsg(res, 400, { message: "User with this email already exist" })
    }

    if(userRole === Roles.Admin){
        const riderExist = await Admin.findOne({ email: req.body.email })
        if (riderExist) return response.errorResMsg(res, 400, { message: "Admin with this email already exist" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    if(userRole === Roles.User){
        const newUser = await User.create({
            firstname: req.body.firstName,
            lastname: req.body.lastName,
            email: req.body.email,
            password: hashPassword,
            phonenumber: req.body.phone,
            role: userRole,
            country: "",
            state: "",
            bio: "",
            profilepicture: "",
            googleId: "",
            linkedinId: "",
            facebookId: ""
        })
        return response.successResMsg(res, 201, { message: newUser })
    }
    else {
        const newUser = await Admin.create({
            firstname: req.body.firstName,
            lastname: req.body.lastName,
            email: req.body.email,
            password: hashPassword,
            phonenumber: req.body.phone,
            role: userRole,
            route: req.body.route,
            active: false,
            profilepicture: "",
            NoOfTrips: 0
        })
        return response.successResMsg(res, 201, { message: newUser })
    }
}

const loginUser = async (req, res) => {
    validateUser(loginSchema)
    const user = await User.findOne({ email: req.body.email })
    if (!user) return response.errorResMsg(res, 400, { message: "Invalid login details" })
    const confirmPassword = await bcrypt.compare(req.body.password, user.password)
    if (!confirmPassword) return response.errorResMsg(res, 400, { message: "Invalid login details" })
    const signature = await createToken({
        _id: user._id,
        email: user.email,
        role: user.role
    })
    return response.successResMsg(res, 201, { message: signature })
}


const resetPasswordSetting = async (req, res) => {
    const user = req.user
    if (!user) return response.errorResMsg(res, 400, { message: "User not found" })
    const findUser = await User.findById(user._id)
    if (!findUser) return response.errorResMsg(res, 400, { message: "User profile not found" })
    const { oldPassword, newPasswordOne, newPasswordTwo } = req.body
    if (newPasswordOne !== newPasswordTwo) return response.errorResMsg(res, 400, { message: "Password does not match" })
    const getUser = await User.findOne({ _id: findUser._id })
    const isValid = await bcrypt.compare(oldPassword, getUser.password)
    if (!isValid) return response.errorResMsg(res, 400, { message: "Please input your correct password" })
    const salt = await bcrypt.genSalt(10)
    const newPasswordHash = await bcrypt.hash(newPasswordOne, salt)
    await User.updateOne(
        { _id: findUser._id },
        { $set: { password: newPasswordHash } },
        { new: true }
    )
    return response.successResMsg(res, 201, { message: "Password was successfully updated" })
}

const updateProfile = async (req, res) => {
    const user = req.body
    console.log(user)
    // const user = req.user
    const findUser = await User.findById(user._id)
    // if (!user) return response.errorResMsg(res, 400, { message: "User not found" })
    if (!findUser) return response.errorResMsg(res, 400, { message: "User profile not found" })
    const { firstName, lastName, phoneNumber, country, state, bio, image } = req.body
    console.log({ firstName, lastName, phoneNumber, country, state, bio, image })
    await User.updateOne({ _id: findUser._id }, {
        firstname: firstName,
        lastname: lastName,
        phonenumber: phoneNumber,
        country,
        state,
        bio,
        profilepicture: image
    })
    return response.successResMsg(res, 201, { message: "User profile has been updated successfully" })
}


const getProfile = async (req, res) => {
    // console.log('hello twitter')
    const user = req.params.id
    // const user = req.user 
    if (!user) return response.errorResMsg(res, 400, { message: "User not found" })
    const findUser = await User.findById(user)
    if (!findUser) return response.errorResMsg(res, 400, { message: "Couldn't find user" })
    // const getUser = await User.findOne({ _id: user._id })
    return response.successResMsg(res, 200, { message: findUser })
}


module.exports = {
    registerPersonnel,
    loginUser,
    resetPasswordSetting,
    updateProfile,
    getProfile
}