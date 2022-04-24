const { errorResMsg, successResMsg } = require('../../utils/libs/response')
const orderModel = require('../../models/Payment/orderModel')
const validateUser = require('../../utils/validations/index')
const User = require('../../models/User/userModel.js')
const Service = require('../../models/service.model')
const _ = require('lodash')
const dotenv = require('dotenv')
const request = require('request')
const axios = require('axios')
dotenv.config()
const Joi = require('joi')

// Payment schema
const paymentSchema = Joi.object({
    paymentType: Joi.string().required(), 
    email: Joi.string().required(), 
    fullname: Joi.string().required(),
    amount: Joi.number().required(),
    serviceId: Joi.string().required()
})


// Payment
const paymentPlatform = async (req, res) => {
    const user = req.user
    if(!user) return errorResMsg(res, 400, { message: "User not found" })
    const findUser = await User.findById(user._id)
    if(!findUser) return errorResMsg(res, 400, { message: "User profile not found" })

    validateUser(paymentSchema)
    const paymentTypeArray = ["paystack", "flutterwave"];
    if (!paymentTypeArray.includes(req.body.paymentType.toLowerCase())) return errorResMsg(res, 400, "Please provide a valid payment type")
    if (req.body.paymentType.toLowerCase() === "paystack") {
        await paystackPayment(req, res, findUser)
    }
}


// Using Paystack
const paystackPayment = async (req, res, findUser) => {
    const findServiceOrder = await Service.findOne({ _id: req.body.serviceId })
    if(!findServiceOrder) return errorResMsg(res, 400, { message: "Please include a service order Id" })
    const form = _.pick(req.body,['amount','email','fullname']);
    console.log(form)
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
    console.log(findUser)
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


// Verify Paystack payment
const paystackVerify = async (req, res) => {
    const reference = req.query.reference
    // const reference = req.params.reference
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
        await orderModel.updateOne(
            { reference: findTxn.reference },
            {$set: {isActive: true}},
            { new: true }
        )     
        const result = response.data
        return successResMsg(res, 201, { message: "Payment was successful", result })
    })
}

module.exports = {
    paymentPlatform,
    paystackVerify
}