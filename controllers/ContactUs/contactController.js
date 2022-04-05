const response = require('../../utils/libs/response')
const Contact = require('../../models/contactUsModel')
const nodemailer = require('nodemailer')
const Joi = require('joi')
const validateUser = require('../../utils/validations/index')

// Register Validation schema
const contactSchema = Joi.object({
    fullName: Joi.string().required(), 
    email: Joi.string().email().required(),
    message: Joi.string().required()
})

const contactUsHandler = async (req, res) => {
    validateUser(contactSchema)
    const { email, fullName, message } = req.body
    const newIssue = await Contact.create({
        fullname: fullName,
        email,
        message
    })

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        auth: {
            user: `${process.env.GMAIL_ADDRESS}`,
            pass: `${process.env.GMAIL_PASSWORD}`
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: email,
        to: `${process.env.GMAIL_ADDRESS}`,
        subject: "Hey Team! We have a Customer Support issue",
        text: message
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) return console.log(error) 
        console.log("Email sent" + info.response)
    })
    response.successResMsg(res, 201, { message: "Thank you for your feedback... We are here to help", newIssue })
}

module.exports = {
    contactUsHandler
}