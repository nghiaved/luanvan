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
        .then(() => res.json({ status: true, message: 'Bạn đã thêm công việc mới!' }))
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

exports.getTasksByStudent = async (req, res, next) => {
    const { student } = req.params

    if (!student) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await taskModel.find({ student })
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
        .then(task => res.json({ status: true, task, message: 'Bạn đã gia hạn công việc!' }))
        .catch(next)
}

exports.evaluateTask = async (req, res, next) => {
    const _id = req.params.id
    const { points, note } = req.body

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

    await taskModel.updateOne({ _id }, { points: parseInt(points), note: note || '' })

    await taskModel.findById(_id)
        .then(task => res.json({ status: true, task, message: 'Bạn đã đánh giá công việc!' }))
        .catch(next)
}

exports.updateTask = async (req, res, next) => {
    const _id = req.params.id
    const { title, description, start, end } = req.body

    if (!_id) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await taskModel.updateOne({ _id }, { title, description, start, end })
        .then(() => res.json({ status: true, message: 'Bạn đã cập nhật công việc!' }))
        .catch(next)
}

exports.deleteTask = async (req, res, next) => {
    const _id = req.params.id

    if (!_id) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await taskModel.findOneAndDelete({ _id })
        .then(() => res.json({ status: true, message: 'Bạn đã xoá công việc!' }))
        .catch(next)
}