const taskModel = require('../models/task.model')

exports.createTask = async (req, res, next) => {
    const { title, description, start, end, student, lecturer } = req.body

    if (!title || !description || !start || !end || !student || !lecturer) {
        return res.json({ status: false, message: 'Not enough information' })
    }

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
        .then(tasks => res.json({ status: true, tasks }))
        .catch(next)
}

exports.extendTask = async (req, res, next) => {
    const _id = req.params.id
    const { days } = req.body

    if (!_id || !days) {
        return res.json({ status: false, message: 'Not enough information' })
    }

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

    await taskModel.updateOne({ _id }, { points: parseInt(points) })

    await taskModel.findById(_id)
        .then(task => res.json({ status: true, task, message: 'Evaluated' }))
        .catch(next)
}