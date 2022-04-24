const validateUser = require('../../utils/validations/index')
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require('bcryptjs')
const User = require('../../models/User/userModel')
const Admin = require('../../models/User/adminModel')
const Token = require('../../models/tokenModel')
const response = require('../../utils/libs/response')
const Joi = require('joi')
const Roles = require("../../middleware/role")
const jwt = require('jsonwebtoken')
const path = require('path')
const { cloudinary } = require('../../utils/libs/cloudinaryUpload')
const crypto = require("crypto")
const { sendGmail } = require('../../utils/libs/email')

// Register Validation schema
const registrationSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    phone: Joi.number().required()
})

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

// Authentication (Registration for both User and Admin)
const registerPersonnel = async (req, res) => {
    validateUser(registrationSchema)
    let userRole;
    var regExp = new RegExp("[a-z0-9\.-_]*@zigara\.com$", "i");
    const match = req.body.email.match(regExp);
    if(match){
        userRole = Roles.Admin
    }
    else {
        userRole = Roles.User
    }
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
        await User.create({
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
        return response.successResMsg(res, 201, { message: "User has successfully been created" })
    }
    else {
        await Admin.create({
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
        return response.successResMsg(res, 201, { message: "An Admin account has successfully been created" })
    }
}

// Handle login for both User and Admin
const loginPersonnel = async (req, res) => {
    validateUser(loginSchema)
    let userRole;
    var regExp = new RegExp("[a-z0-9\.-_]*@zigara\.com$", "i");
    const match = req.body.email.match(regExp);
    if(match){
        userRole = Roles.Admin
    }
    else {
        userRole = Roles.User
    }
    if(userRole === Roles.User){
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
    else{
        const admin = await Admin.findOne({ email: req.body.email, role: Roles.Admin  })
        if (!admin) return response.errorResMsg(res, 400, { message: "Invalid login details" })
        const confirmPassword = await bcrypt.compare(req.body.password, admin.password)
        if (!confirmPassword) return response.errorResMsg(res, 400, { message: "Invalid login details" })
        const signature = await createToken({
            _id: admin._id,
            email: admin.email,
            role: admin.role
        })
        return response.successResMsg(res, 201, { message: signature })
    }
}

// Reset password screen
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

// Update profile screen
const updateProfile = async (req, res) => {
    const user = req.user
    if (!user) return response.errorResMsg(res, 400, { message: "User not found" })
    const findUser = await User.findById(user._id)
    if (!findUser) return response.errorResMsg(res, 400, { message: "User profile not found" })
    const { firstName, lastName, phoneNumber, country, state, bio } = req.body
    const data = req.file.path
    const filePath = path.join(__dirname, `../../${data}`)
    console.log(filePath)
    const uploadedResponse = await cloudinary.uploader.upload(filePath);
    await User.updateOne({ _id: findUser._id }, {
        firstname: firstName,
        lastname: lastName,
        phonenumber: phoneNumber, 
        country,
        state,
        bio,
        profilepicture: uploadedResponse.secure_url
    })
    return response.successResMsg(res, 201, { message: "User profile has been updated successfully", findUser })
}
 
// Get User profile
const getProfile = async (req, res) => {
    const user = req.user
    if (!user) return response.errorResMsg(res, 400, { message: "User not found" })
    const findUser = await User.findById(user._id)
    if (!findUser) return response.errorResMsg(res, 400, { message: "User profile not found" })
    return response.successResMsg(res, 200, { message: findUser })
}

// Forgot password screen
const forgotPassword = async (req, res) => {
    const findUser = await User.findOne({ email: req.body.email })
    if(!findUser) return response.errorResMsg(res, 400, { message: "User does not exist" })
    let findToken = await Token.findOne({ user: findUser.id })
    if(!findToken){
        findToken = await Token.create({
            user: findUser.id,
            token: crypto.randomBytes(32).toString('hex')
        })
    }
    const link = `${process.env.BASE_URL}/password-reset/${findUser.id}/${findToken.token}`
    let mailOptions = {
        fromEmail: `${process.env.GMAIL_ADDRESS}`,
        toEmail: req.body.email,
        subject: "Password Reset Request",
        text: link
    }
    await sendGmail(mailOptions)
    return response.successResMsg(res, 200, { message: "A password reset mail have been set to you" })
}

const setNewPassword = async (req, res) => {
    const schema = Joi.object({ password: Joi.string().required() })
    validateUser(schema)
    const userId = req.params.id
    const tokenId = req.params.token
    const findUser = await User.findById(userId)
    if(!findUser) return response.errorResMsg(res, 400, { message: "Invalid link" })
    let findToken = await Token.findOne({
        user: findUser._id,
        token: tokenId
    }) 
    if(!findToken) return response.errorResMsg(res, 400, { message: "Invalid link" })
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    console.log(hashPassword)
    await User.updateOne({ _id: userId }, {
        password: hashPassword
    })
    return successResMsg(res, 201, { message: "Your password has been updated successfully", findUser })
}


module.exports = {
    registerPersonnel,
    loginPersonnel,
    resetPasswordSetting,
    updateProfile,
    getProfile,
    forgotPassword
}