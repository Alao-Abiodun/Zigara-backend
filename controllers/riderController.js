const Admin = require('../models/User/adminModel')
const { errorResMsg, successResMsg } = require('../utils/libs/response')

// Get all rider's details
const getAllRidersDetails = async (req, res) => {
    const user = req.body
    const findAdmin = await Admin.findById(user._id)
    if (!findAdmin) return response.errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const riders = await Admin.find()
    if(!riders) return errorResMsg(res, 400, { message: "You don't have any rider yet." })
    return successResMsg(res, 200, { message: riders })
}

// Get rider profile
const getRiderDetails = async (req, res) => {
    const user = req.body
    const findAdmin = await Admin.findById(user._id)
    if (!findAdmin) return response.errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const riderId = req.params.id
    const riderProfile = await Admin.findById(riderId)
    if(!riderProfile) return errorResMsg(res, 400, { message: "Rider profile not found" })
    return successResMsg(res, 200, { message: riderProfile })
}

// Updates rider's active status
const updateRiderStatus = async (req, res) => {
    const user = req.body
    const findAdmin = await Admin.findById(user._id)
    if (!findAdmin) return response.errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const riderId = req.params.id
    const riderProfile = await Rider.findById(riderId)
    if(!riderProfile) return errorResMsg(res, 400, { message: "Rider profile not found" }) 
    riderProfile.status = !riderProfile.status
    const result = await riderProfile.save()
    return successResMsg(res, 201, { message: result })
}

// Update rider information
const updateRider = async (req, res) => {
    const user = req.body
    const findAdmin = await Admin.findById(user._id)
    if (!findAdmin) return response.errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const riderId = req.params.id
    const findRider = await Admin.findById(riderId)
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
    const findAdmin = await Admin.findById(user._id)
    if (!findAdmin) return response.errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const topThree = await Admin.find().sort('NoOfTrips').limit(3)
    return successResMsg(res, 200, { message: topThree })
}

// Delete Rider
const deleteRider = async (req, res) => {
    const user = req.body
    const findAdmin = await Admin.findById(user._id)
    if (!findAdmin) return response.errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const riderId = req.params.id
    const findRider = await Admin.findById(riderId)
    if(!findRider) return errorResMsg(res, 400, { message: "Rider does not exist" })
    await Rider.deleteOne({ _id: riderId })
    return successResMsg(res, 201, { message: "Rider has been deleted successfully" })
}


module.exports = {
    getRiderDetails,
    updateRiderStatus,
    highestRiders,
    getAllRidersDetails,
    deleteRider,
    updateRider
}