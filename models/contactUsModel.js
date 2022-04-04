const mongoose = require('mongoose')
const schema = mongoose.Schema

const contactSchema = new schema({
    fullname: {
        type: String
    },
    email: {
        type: String
    },
    message: {
        type: String
    }
})

const ContactUs = mongoose.model('contact', contactSchema)
module.exports = ContactUs