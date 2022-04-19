const mongoose = require('mongoose')
const schema = mongoose.Schema

const orderSchema = new schema({
    firstname: String,
    lastname: String,
    email: String,
    amount: Number,
    reference: String,
    isActive: Boolean,
    user: {
        type: schema.Types.ObjectId,
        ref: "Service",
    },
    order: {
        type: schema.Types.ObjectId,
        ref: "User",
    },
})

const Order = mongoose.model('order', orderSchema)
module.exports = Order