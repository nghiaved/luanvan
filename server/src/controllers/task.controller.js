const taskModel = require('../models/task.model')
const messageModel = require('../models/message.model')

exports.createTask = async (req, res, next) => {
    const { title, description, start, end, student, lecturer } = req.body

    if (!title || !description || !start || !end || !student || !lecturer) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await messageModel.create({
        content: 'đã thêm công việc mới.',
        sender: lecturer,
        reader: student,
        status: false
    })

    await taskModel.create({ title, description, start, end, student, lecturer, status: false })
        .then(() => res.json({ status: true, message: 'Created' }))
        .catch(next)
}

exports.getTasksByStudentLecturer = async (req, res, next) => {
    const { student, lecturer } = req.query

    if (!student || !lecturer) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await taskModel.find({ student, lecturer })
        .populate('student', 'username')
        .populate('lecturer', 'username')
        .then(tasks => res.json({ status: true, tasks }))
        .catch(next)
}

exports.extendTask = async (req, res, next) => {
    const _id = req.params.id
    const { days } = req.body

    if (!_id || !days) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    const task = await taskModel.findById(_id)

    await messageModel.create({
        content: 'đã gia hạn công việc.',
        sender: task.lecturer,
        reader: task.student,
        status: false
    })

    await taskModel.updateOne({ _id }, { end: days })

    await taskModel.findById(_id)
        .then(task => res.json({ status: true, task, message: 'Extended' }))
        .catch(next)
}

exports.evaluateTask = async (req, res, next) => {
    const _id = req.params.id
    const { points } = req.body

    if (!_id || !points) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    const task = await taskModel.findById(_id)

    await messageModel.create({
        content: 'đã đánh giá công việc.',
        sender: task.lecturer,
        reader: task.student,
        status: false
    })

    await taskModel.updateOne({ _id }, { points: parseInt(points) })

    await taskModel.findById(_id)
        .then(task => res.json({ status: true, task, message: 'Evaluated' }))
        .catch(next)
}