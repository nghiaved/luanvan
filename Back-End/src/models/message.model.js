const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    content: String,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: Boolean
})

const Message = mongoose.models.Message || mongoose.model('Message', messageSchema)

module.exports = Message
