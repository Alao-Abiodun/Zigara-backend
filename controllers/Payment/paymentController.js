const { initializePayment, verifyPayment } = require('./Paystack')
const { errorResMsg, successResMsg } = require('../../utils/libs/response')
const orderModel = require('../../models/Payment/orderModel')
const User = require('../../models/User/userModel.js')
const Service = require('../../models/service.model')
const _ = require('lodash')
const dotenv = require('dotenv')
const request = require('request')
dotenv.config()

// Using Paystack
const paystackPayment = async (req, res) => {
    const user = req.user
    if(!user) return errorResMsg(res, 400, { message: "User not found" })
    const findUser = await User.findById(user._id)
    if(!findUser) return errorResMsg(res, 400, { message: "User profile not found" })
    const findServiceOrder = await Service.findOne({ _id: serviceId })
    if(!findServiceOrder) return errorResMsg(res, 400, { message: "Please include a service order Id" })
    const form = _.pick(req.body,['amount','email','fullname']);
    form.metadata = {
        fullname : form.fullname
    }
    form.amount *= 100
    const options = {
        url: 'https://api.paystack.co/transaction/initialize',
        headers: {
            authorization: `${process.env.PaystackSK}`,
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        form  
    }
    request.post(options, async (error, response, body) => {
        if(error) return errorResMsg(res, 400, { message: error })
        const jsonData = JSON.parse(body)
        const newOrder = await orderModel.create({
            firstname: findUser.firstname,
            lastname: findUser.lastname, 
            email: findUser.email,
            amount: req.body.amount,
            isActive: false,
            user: req.user._id,
            order: findServiceOrder._id,
            reference: jsonData.data.reference
        })
        return successResMsg(res, 201, { message: jsonData, newOrder })
    })
}


const paystackVerify = async (req, res) => {
    // const reference = req.query.reference
    const reference = req.params.reference
    const options = {
        url: 'https://api.paystack.co/transaction/verify/'+encodeURIComponent(reference),
        headers: {
            authorization: `${process.env.PaystackSK}`,
            "content-type": "application/json",
            "cache-control": "no-cache"
        }
    }
    request(options, async (error, response, body) => {
        if(error) return errorResMsg(res, 400, { message: error })
        response = JSON.parse(body)
        if(!response.status) return errorResMsg(res, 400, { message: "An error occured with this transaction" })
        if(response.data.status == "abandoned" || response.data.status == "Abandoned") return errorResMsg(res, 400, { message: "Your transaction is not yet complete" })
        const findTxn = await orderModel.findOne({ reference })
        if(!findTxn) return errorResMsg(res, 400, { message: "Transaction cannot be found" })
        const findOrder = await orderModel.updateOne(
            { reference: findTxn.reference },
            {$set: {isActive: true}},
            { new: true }
        )     
        const result = response.data
        return successResMsg(res, 201, { message: "Payment was successful", result })
    })
}

module.exports = {
    paystackPayment,
    paystackVerify
}