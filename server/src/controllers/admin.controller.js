const userModel = require('../models/user.model')
const topicModel = require('../models/topic.model')
const registerModel = require('../models/register.model')
const messageModel = require('../models/message.model')

exports.getHome = async (req, res, next) => {
    const students = await userModel.find({ role: 2 })
    const lecturers = await userModel.find({ role: 1 })
    const topics = await topicModel.find()
    const registers = await registerModel.find({ status: true })
    res.json({ status: true, students, lecturers, topics, registers })
}

exports.getAllStudents = async (req, res, next) => {
    const students = await userModel.find({ role: 2 })
    res.json({ status: true, students })
}

exports.getAllLecturers = async (req, res, next) => {
    const lecturers = await userModel.find({ role: 1 })
    res.json({ status: true, lecturers })
}

exports.getAllTopics = async (req, res, next) => {
    const topics = await topicModel.find()
        .populate('lecturer', 'fullname username')
    res.json({ status: true, topics })
}

exports.getAllRegisters = async (req, res, next) => {
    const registers = await registerModel.find({ status: true })
        .populate('topic', 'title')
        .populate('student', 'fullname username')
        .populate('lecturer', 'fullname username')
    res.json({ status: true, registers })
}

exports.acceptUser = async (req, res, next) => {
    const _id = req.params.id

    if (!_id) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await userModel.findByIdAndUpdate(_id, { status: true })
        .then(() => res.json({ status: true, message: 'Accepted' }))
        .catch(next)
}

exports.refuseUser = async (req, res, next) => {
    const _id = req.params.id

    if (!_id) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await userModel.findByIdAndDelete(_id)
        .then(() => res.json({ status: true, message: 'Refused' }))
        .catch(next)
}

exports.acceptTopic = async (req, res, next) => {
    const _id = req.params.id

    if (!_id) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    const topic = await topicModel.findById(_id)

    await messageModel.create({
        content: 'đã được xác nhận đề tài.',
        sender: topic.lecturer,
        reader: topic.lecturer,
        status: false
    })

    await topicModel.findByIdAndUpdate(_id, { status: true })
        .then(() => res.json({ status: true, message: 'Accepted' }))
        .catch(next)
}

exports.refuseTopic = async (req, res, next) => {
    const _id = req.params.id

    if (!_id) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    const topic = await topicModel.findById(_id)

    await messageModel.create({
        content: 'đã bị từ chối đề tài.',
        sender: topic.lecturer,
        reader: topic.lecturer,
        status: false
    })

    await topicModel.findByIdAndDelete(_id)
        .then(() => res.json({ status: true, message: 'Refused' }))
        .catch(next)
}