const messageModel = require('../models/message.model')

exports.getMessages = async (req, res, next) => {
    const { id } = req.params

    if (!id) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await messageModel.find({ reader: id })
        .populate('sender', 'fullname')
        .populate('topic', 'title')
        .then(messages => res.json({ status: true, messages }))
        .catch(next)
}