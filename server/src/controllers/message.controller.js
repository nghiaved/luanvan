const taskModel = require('../models/task.model')
const messageModel = require('../models/message.model')

exports.getMessages = async (req, res, next) => {
    const { id } = req.params

    if (!id) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await messageModel.find({ reader: id })
        .populate('sender', 'fullname')
        .then(messages => res.json({ status: true, messages }))
        .catch(next)
}

exports.readMessage = async (req, res, next) => {
    const reader = req.params.id

    if (!reader) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await messageModel.findByIdAndUpdate(reader, { status: true })
        .then(() => res.json({ status: true, message: 'Updated' }))
        .catch(next)
}

exports.readAllMessages = async (req, res, next) => {
    const reader = req.params.id

    if (!reader) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await messageModel.updateMany({ reader }, { status: true })
        .then(() => res.json({ status: true, message: 'Updated' }))
        .catch(next)

}

exports.deleteMessage = async (req, res, next) => {
    const reader = req.params.id

    if (!reader) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await messageModel.findByIdAndDelete(reader)
        .then(() => res.json({ status: true, message: 'Deleted' }))
        .catch(next)
}

exports.deleteAllMessages = async (req, res, next) => {
    const reader = req.params.id

    if (!reader) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await messageModel.deleteMany({ reader })
        .then(() => res.json({ status: true, message: 'Deleted' }))
        .catch(next)
}

exports.remindMessage = async (req, res, next) => {
    const { content, taskId } = req.body

    if (!content || !taskId) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    const task = await taskModel.findById(taskId)

    await messageModel.create({
        content: `đã nhắc nhở: "${content}"`,
        sender: task.lecturer,
        reader: task.student,
        status: false
    })
        .then(() => res.json({ status: true, message: 'Created' }))
        .catch(next)
}