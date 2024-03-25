const registerModel = require('../models/register.model')
const messageModel = require('../models/message.model')
const topicModel = require('../models/topic.model')

exports.createRegister = async (req, res, next) => {
    const { topic, student, lecturer } = req.body

    if (!topic || !student || !lecturer) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await messageModel.create({
        content: 'đã đăng ký đề tài.',
        sender: student,
        reader: lecturer,
        status: false
    })

    await registerModel.create({ topic, student, lecturer, status: false })
        .then(() => res.json({ status: true, message: 'Created' }))
        .catch(next)
}

exports.getRegistersByLecturer = async (req, res, next) => {
    const { lecturer } = req.params

    if (!lecturer) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await registerModel.find({ lecturer })
        .populate('topic')
        .populate('student', 'fullname username')
        .then(registers => res.json({ status: true, registers }))
        .catch(next)
}

exports.acceptRegister = async (req, res, next) => {
    const _id = req.params.id

    if (!_id) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    const register = await registerModel.findById(_id)

    const topic = await topicModel.findById(register.topic)
    await topicModel.updateOne({ _id: topic._id }, { registered: topic.registered + 1 })

    await messageModel.create({
        content: 'đã chấp nhận đăng ký.',
        sender: register.lecturer,
        reader: register.student,
        status: false
    })

    await registerModel.updateOne({ _id }, { status: true })
        .then(() => res.json({ status: true, message: 'Accepted' }))
        .catch(next)
}

exports.refuseRegister = async (req, res, next) => {
    const _id = req.params.id

    if (!_id) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    const register = await registerModel.findById(_id)

    await messageModel.create({
        content: 'đã từ chối đăng ký.',
        sender: register.lecturer,
        reader: register.student,
        status: false
    })

    await registerModel.findOneAndDelete({ _id })
        .then(() => res.json({ status: true, message: 'Refused' }))
        .catch(next)
}

exports.getRegister = async (req, res, next) => {
    const { topic, student } = req.query

    if (!topic || !student) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await registerModel.findOne({ topic, student })
        .then(register => res.json({ status: true, register }))
        .catch(next)
}

exports.getRegisters = async (req, res, next) => {
    const { topic, lecturer } = req.query

    if (!topic || !lecturer) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await registerModel.find({ topic, lecturer })
        .populate('student', 'fullname username')
        .then(registers => res.json({ status: true, registers }))
        .catch(next)
}

exports.getRegisterByStudent = async (req, res, next) => {
    const { student } = req.params

    if (!student) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await registerModel.findOne({ student })
        .populate('topic', 'title description')
        .populate('lecturer', 'fullname username')
        .then(register => res.json({ status: true, register }))
        .catch(next)
}

exports.finalTopic = async (req, res, next) => {
    const { student } = req.params
    const { final } = req.body

    if (!student) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await registerModel.findOneAndUpdate({ student }, { final })
        .then(async register => await messageModel.create({
            content: `đã ${final ? 'hoàn thành' : 'chấm dứt'} đề tài.`,
            sender: register.lecturer,
            reader: register.student,
            status: false
        }))
        .then(() => res.json({ status: true, message: final ? 'Finished' : 'Terminated' }))
        .catch(next)
}
