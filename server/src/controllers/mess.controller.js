const messModel = require('../models/mess.model')

exports.sendMess = async (req, res, next) => {
    const { register, sender, reader, content } = req.body

    if (!register || !sender || !reader || !content) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await messModel.create({ register, sender, reader, content })
        .then(() => res.json({ status: true, message: 'Created' }))
        .catch(next)
}

exports.getMesses = async (req, res, next) => {
    const { register } = req.params

    if (!register) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await messModel.find({ register })
        .then(messes => res.json({ status: true, messes }))
        .catch(next)
}

exports.readMesses = async (req, res, next) => {
    const { register, reader } = req.body

    if (!register || !reader) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await messModel.updateMany({ register, reader }, { status: true })
        .then(() => res.json({ status: true, message: 'Updated' }))
        .catch(next)
}