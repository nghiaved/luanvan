const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    name: String,
    url: String,
    time: Date,
    task: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
    },
    note: String,
})

const File = mongoose.models.File || mongoose.model('File', fileSchema)

module.exports = File
