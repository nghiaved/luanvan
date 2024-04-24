const fileModel = require('../models/file.model')
const taskModel = require('../models/task.model')
const messageModel = require('../models/message.model')
const path = require('path')

exports.uploadFile = async (req, res, next) => {
    const { task, note } = req.body

    const file = {
        name: req.file.originalname,
        url: req.file.path,
        time: new Date(),
        task, note: note || ''
    }

    const taskResult = await taskModel.findById(task)

    await messageModel.create({
        content: 'đã đăng tải nội dụng.',
        sender: taskResult.student,
        reader: taskResult.lecturer,
        status: false
    })

    await taskModel.updateOne({ _id: task }, { status: true })

    await fileModel.create(file)
        .then(() => res.json({ status: true, message: 'Bạn đã đăng tải nội dung!' }))
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