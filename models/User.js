const mongoose = require('mongoose')
const { v4 } = require('uuid')
const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    profileProto: String,
    activationCode: {
        type: String,
        default: v4() + Date.now(),
    },
    password: String,
})

module.exports = mongoose.model('User', userSchema)
