const Admin = require('../models/User/adminModel')
const { errorResMsg, successResMsg } = require('../utils/libs/response')
const validateUser = require('../utils/validations/index')
const role = require('../middleware/role')
const Joi = require('joi')

// Rider registration schema
const registrationSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    route: Joi.string().required(),
    phone: Joi.number().required()
})

const registerRider = async (req, res) => {
    const user = req.user
    const findAdmin = await Admin.find({ id: user._id, role: role.Admin })
    if (!findAdmin) return errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    validateUser(registrationSchema)
    const newUser = await Admin.create({
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        email: `${req.body.firstName.toLowerCase()}.${req.body.lastName.toLowerCase()}@zigara.com`,
        password: "",
        phonenumber: req.body.phone,
        role: role.Rider,
        route: req.body.route,
        active: false,
        profilepicture: "",
        NoOfTrips: 0
    })
    return successResMsg(res, 201, { message: newUser })
}

// Get all rider's details
const getAllRidersDetails = async (req, res) => {
    const user = req.user
    const findAdmin = await Admin.find({ id: user._id, role: role.Admin })
    if (!findAdmin) return errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const riders = await Admin.find({ role: role.Rider })
    if(!riders) return errorResMsg(res, 400, { message: "You don't have any rider yet." })
    return successResMsg(res, 200, { message: riders })
}

// Get rider profile
const getRiderDetails = async (req, res) => {
    const user = req.user
    const findAdmin = await Admin.find({ id: user._id, role: role.Admin })
    if (!findAdmin) return errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const riderId = req.params.id
    const riderProfile = await Admin.find({ _id: riderId, role: role.Rider })
    console.log(riderId)
    console.log(riderProfile)
    if(!riderProfile) return errorResMsg(res, 400, { message: "Rider profile not found" })
    return successResMsg(res, 200, { message: riderProfile })
}

// Updates rider's active status
const updateRiderStatus = async (req, res) => {
    const user = req.user
    const findAdmin = await Admin.find({ id: user._id, role: role.Admin })
    if (!findAdmin) return errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const riderId = req.params.id
    const riderProfile = await Admin.find({ _id: riderId, role: role.Rider })
    if(!riderProfile) return errorResMsg(res, 400, { message: "Rider profile not found" }) 
    const newStatus = !riderProfile[0].active    
    await Admin.updateOne({ _id: riderId }, {
        active: newStatus
    })
    return successResMsg(res, 201, { message: "User profile has been updated successfully", riderProfile })
}   

// Update rider information
const updateRider = async (req, res) => {
    const user = req.user
    const findAdmin = await Admin.find({ id: user._id, role: role.Admin })
    if (!findAdmin) return errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const riderId = req.params.id
    const riderProfile = await Admin.find({ _id: riderId, role: role.Rider })
    if(!riderProfile) return errorResMsg(res, 400, { message: "Rider profile not found" }) 
    const {firstName, lastName, phoneNumber, address} = req.body
    const newStatus = !riderProfile[0].active
    await Admin.updateOne({ _id: riderId }, {
        firstname: firstName,
        lastname: lastName,
        phonenumber: phoneNumber, 
        route: address,
        active: newStatus
    })
    return successResMsg(res, 201, { message: "Rider information has been updated successfully", riderProfile })
}

// Get Highest riders
const highestRiders = async (req, res) => {
    const user = req.user
    const findAdmin = await Admin.find({ id: user._id, role: role.Admin })
    if (!findAdmin) return errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const topThree = await Admin.find({ role: role.Rider }).sort('NoOfTrips').limit(3)
    return successResMsg(res, 200, { message: topThree })
}

// Delete Rider
const deleteRider = async (req, res) => {
    const user = req.user
    const findAdmin = await Admin.find({ id: user._id, role: role.Admin })
    if (!findAdmin) return errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const riderId = req.params.id
    const findRider = await Admin.find({ id: riderId, role: role.Rider })
    if(!findRider) return errorResMsg(res, 400, { message: "Rider does not exist" })
    await Admin.deleteOne({ _id: riderId })
    return successResMsg(res, 201, { message: "Rider has been deleted successfully" })
}


module.exports = {
    registerRider,
    getRiderDetails,
    updateRiderStatus,
    highestRiders,
    getAllRidersDetails,
    deleteRider,
    updateRider
}