const taskModel = require('../models/task.model')

exports.createTask = async (req, res, next) => {
    const { title, description, start, end, student, lecturer } = req.body

    if (!title || !description || !start || !end || !student || !lecturer) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await taskModel.create({ title, description, start, end, student, lecturer })
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