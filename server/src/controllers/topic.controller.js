const topicModel = require('../models/topic.model')

exports.createTopic = async (req, res, next) => {
    const { title, description, lecturer } = req.body

    if (!title || !description || !lecturer) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await topicModel.create({ title, description, lecturer })
        .then(() => res.json({ status: true, message: 'Bạn đã thêm đề tài mới!' }))
        .catch(next)
}

exports.getTopicsByLecturer = async (req, res, next) => {
    const { lecturer } = req.params

    if (!lecturer) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    const topics = await topicModel.find({ lecturer })
        .populate('lecturer', 'fullname username')
    res.json({ status: true, topics })
}

exports.getAllTopics = async (req, res, next) => {
    const topics = await topicModel.find()
        .populate('lecturer', 'fullname username avatar')
    res.json({ status: true, topics })
}

exports.getTopicBySlug = async (req, res, next) => {
    const { slug } = req.params

    if (!slug) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    const topic = await topicModel.findOne({ slug })
        .populate('lecturer', 'fullname username')
    res.json({ status: true, topic })
}

exports.updateTopic = async (req, res, next) => {
    const _id = req.params.id
    const { title, description } = req.body

    if (!_id) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await topicModel.updateOne({ _id }, { title, description })
        .then(() => res.json({ status: true, message: 'Bạn đã cập nhật đề tài!' }))
        .catch(next)
}

exports.deleteTopic = async (req, res, next) => {
    const _id = req.params.id

    if (!_id) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await topicModel.findOneAndDelete({ _id })
        .then(() => res.json({ status: true, message: 'Bạn đã xoá đề tài!' }))
        .catch(next)
}