const fileModel = require('../models/file.model')
const taskModel = require('../models/task.model')

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
            res.json({
                status: true,
                message: 'Downloaded',
                path: `http://localhost:8000${file.url.replace('src/uploads', '')}`
            })
        })
        .catch(next)
}