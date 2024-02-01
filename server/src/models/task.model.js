const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    start: Date,
    end: Date,
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema)

module.exports = Task
