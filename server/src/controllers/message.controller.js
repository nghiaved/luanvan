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