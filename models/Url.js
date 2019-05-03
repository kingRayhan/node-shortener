const mongoose = require('mongoose')

const urlShortener = new mongoose.Schema({
    acronym: String,
    redirectTo: String,
    author: mongoose.Types.ObjectId,
})

module.exports = mongoose.model('Url', urlShortener)
