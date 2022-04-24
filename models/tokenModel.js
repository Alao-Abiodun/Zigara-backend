const mongoose = require('mongoose')
const schema = mongoose.Schema

const tokenSchema = new schema({
    user: {
        type: schema.Types.ObjectId,
        ref: "user",
    },
    token: String,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600,
    }
})

const Token = mongoose.model('token', tokenSchema)
module.exports = Token