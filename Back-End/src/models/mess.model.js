const mongoose = require('mongoose')

const messSchema = new mongoose.Schema({
    register: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Register'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: String,
    status: {
        type: Boolean,
        default: false
    }
})

const Mess = mongoose.models.Mess || mongoose.model('Mess', messSchema)

module.exports = Mess
