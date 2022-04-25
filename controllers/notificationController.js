const Admin = require('../models/User/adminModel')
const ContactMessages = require('../models/contactUsModel')
const { errorResMsg, successResMsg } = require('../utils/libs/response')
const role = require('../middleware/role')


// Get all messages
const getAllMessages = async (req, res) => {
    const user = req.user
    const findAdmin = await Admin.find({ id: user._id, role: role.Admin })
    if (!findAdmin) return errorResMsg(res, 400, { message: "You are not authorized to view this page" })
    const notifications = await ContactMessages.find()
    if(!notifications) return errorResMsg(res, 400, { message: "You don't have any messages yet." })
    return successResMsg(res, 200, { message: notifications })
}

module.exports = {
    getAllMessages
}