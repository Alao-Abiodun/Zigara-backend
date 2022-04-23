const Admin = require('../models/User/adminModel')
const { errorResMsg, successResMsg } = require('../utils/libs/response')
const validateUser = require('../utils/validations/index')
const role = require('../middleware/role')

// Rider registration schema
const registrationSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    route: Joi.string().required(),
    phone: Joi.number().required()
})

const registerRider = async (req, res) => {
    const user = req.body
    // const findAdmin = await Admin.findById(user._id)
    const findAdmin = await Admin.findOne({ id: user._id, role: role.Admin })
    if (!findAdmin) return response.errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    validateUser(registrationSchema)
    const newUser = await Admin.create({
        firstname: req.body.firstName,
        lastname: req.body.lastName,
        email: `${req.body.firstName}.${req.body.lastName}@zigara.com`,
        password: "",
        phonenumber: req.body.phone,
        role: role.Rider,
        route: req.body.route,
        active: false,
        profilepicture: "",
        NoOfTrips: 0
    })
    return response.successResMsg(res, 201, { message: newUser })
}

// Get all rider's details
const getAllRidersDetails = async (req, res) => {
    const user = req.body
    const findAdmin = await Admin.findOne({ id: user._id, role: role.Admin })
    if (!findAdmin) return response.errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const riders = await Admin.find({ role: role.Rider })
    if(!riders) return errorResMsg(res, 400, { message: "You don't have any rider yet." })
    return successResMsg(res, 200, { message: riders })
}

// Get rider profile
const getRiderDetails = async (req, res) => {
    const user = req.body
    const findAdmin = await Admin.findOne({ id: user._id, role: role.Admin })
    if (!findAdmin) return response.errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const riderId = req.params.id
    const riderProfile = await Admin.findOne({ id: riderId, role: role.Rider })
    if(!riderProfile) return errorResMsg(res, 400, { message: "Rider profile not found" })
    return successResMsg(res, 200, { message: riderProfile })
}

// Updates rider's active status
const updateRiderStatus = async (req, res) => {
    const user = req.body
    const findAdmin = await Admin.findOne({ id: user._id, role: role.Admin })
    if (!findAdmin) return response.errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const riderId = req.params.id
    const riderProfile = await Rider.findOne({ id: riderId, role: role.Rider })
    if(!riderProfile) return errorResMsg(res, 400, { message: "Rider profile not found" }) 
    riderProfile.status = !riderProfile.status
    const result = await riderProfile.save()
    return successResMsg(res, 201, { message: result })
}

// Update rider information
const updateRider = async (req, res) => {
    const user = req.body
    const findAdmin = await Admin.findOne({ id: user._id, role: role.Admin })
    if (!findAdmin) return response.errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const riderId = req.params.id
    const findRider = await Admin.findOne({ id: riderId, role: role.Rider })
    if(!findRider) return errorResMsg(res, 400, { message: "Rider does not exist" })
    findRider.firstname = req.body.firstName,
    findRider.lastName = req.body.lastName,
    findRider.phonenumber = req.body.phonenumber,
    findRider.route = req.body.address

    await findRider.save()
    return successResMsg(res, 201, { message: "Rider information has been updated successfully" })
}

// Get Highest riders
const highestRiders = async (req, res) => {
    const user = req.body
    const findAdmin = await Admin.findOne({ id: user._id, role: role.Admin })
    if (!findAdmin) return response.errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const topThree = await Admin.find({ role: role.Rider }).sort('NoOfTrips').limit(3)
    return successResMsg(res, 200, { message: topThree })
}

// Delete Rider
const deleteRider = async (req, res) => {
    const user = req.body
    const findAdmin = await Admin.findOne({ id: user._id, role: role.Admin })
    if (!findAdmin) return response.errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const riderId = req.params.id
    const findRider = await Admin.findOne({ id: riderId, role: role.Rider })
    if(!findRider) return errorResMsg(res, 400, { message: "Rider does not exist" })
    await Rider.deleteOne({ _id: riderId })
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