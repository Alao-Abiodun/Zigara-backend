const validateUser = require('../../utils/validations/index')
const bcrypt = require('bcryptjs')
const User = require('../../models/User/userModel')
const response = require('../../utils/libs/response')
const Joi = require('joi')

// Register Validation schema
const registrationSchema = Joi.object({
    firstName: Joi.string().required(), 
    lastName: Joi.string().required(), 
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    phone: Joi.number().required()
})

// login Validation schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8)
})

// Authentication
const registerUser = (req, res) => {
    validateUser(registrationSchema)
    // Continue with registration logic
    //Please Note: While creating a new user, use assign from the model userId: uuid.v4() 
}

const loginUser = (req, res) => {
    validateUser(loginSchema)
    // Continue with login logic
}


const resetPassword = async (req, res) => {
    // Authentication (req.user), then get mail from hash for findUser function below
    // Put all the reset password functions under the authorization check (req.user)
    const {userId, email, oldPassword, newPasswordOne, newPasswordTwo } = req.body
    if(newPasswordOne !== newPasswordTwo){
        return res.status(400).json({ message: "Password does not match" })
    }
    const findUser = await User.findOne({ email })
    const isValid = await bcrypt.compare(oldPassword, findUser.password)
    if(!isValid) return res.status(400).json({ message: "Invalid password input" })
    const salt = await bcrypt.genSalt(10)
    const newPasswordHash = await bcrypt.hash(newPasswordOne, salt)
    await User.updateOne(
        {userId: userId },
        {$set: {password: newPasswordHash}},
        { new: true }
    )     
    return response.successResMsg(res, 201, { message: "Password was successfully updated" })
}

const updateProfile = async (req, res) => {
    // Authentication (req.user), then get mail from hash for findUser function below
    // Put all the reset password functions under the authorization check (req.user)
    const userId = req.params.userid
    const findUser = await User.findOne({ userId })
    const { firstName, lastName, phoneNumber, country, state, bio } = req.body
    if(findUser){
        //firstname, lastname, phone number, country, state, bio
        findUser.firstname = firstName,
        findUser.lastname = lastName,
        findUser.phonenumber = phoneNumber,
        findUser.country = country,
        findUser.state = state, 
        findUser.bio = bio

        const savedUser = await findUser.save()
        return response.successResMsg(res, 201, { message: "User profile has been updated successfully", savedUser })
    } 
    return response.successResMsg(res, 400, { message: "User profile not found" })
}


module.exports = {
    registerUser,
    loginUser,
    resetPassword,
    updateProfile
}