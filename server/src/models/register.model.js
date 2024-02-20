const mongoose = require('mongoose')

const registerSchema = new mongoose.Schema({
    topic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topic'
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: Boolean,
    final: Boolean
})

const Register = mongoose.models.Register || mongoose.model('Register', registerSchema)

module.exports = Register
