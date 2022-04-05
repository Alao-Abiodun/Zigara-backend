const mongoose = require('mongoose')
const schema = mongoose.Schema

const contactSchema = new schema({
    fullname: String,
    email: String,
    message: String
})

const ContactUs = mongoose.model('contact', contactSchema)
module.exports = ContactUs