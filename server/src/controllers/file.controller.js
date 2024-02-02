const fileModel = require('../models/file.model')
const taskModel = require('../models/task.model')
const path = require('path')

exports.uploadFile = async (req, res, next) => {
    const file = {
        name: req.file.originalname,
        url: req.file.path,
        time: new Date(),
        task: req.body.task
    }

    await taskModel.updateOne({ _id: req.body.task }, { status: true })

    await fileModel.create(file)
        .then(() => res.json({ status: true, message: 'Uploaded' }))
        .catch(next)
}

exports.downloadFile = async (req, res, next) => {
    const { task } = req.params

    await fileModel.findOne({ task })
        .then(file => {
            res.download(path.join(__dirname, `../../${file.url}`))
        })
        .catch(next)
}

exports.getFile = async (req, res, next) => {
    const { task } = req.params

    await fileModel.findOne({ task })
        .then(file => file
            ? res.json({ status: true, file })
            : res.json({ status: false })
        )
        .catch(next)
}