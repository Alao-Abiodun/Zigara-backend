const mongoose = require('mongoose')
const schema = mongoose.Schema

const adminSchema = new schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    phonenumber: Number,
    role: String,
    route: String,
    active: Boolean,
    profilepicture: String,
    NoOfTrips: Number
})

const Admin = mongoose.model('admin', adminSchema)
module.exports = Admin