const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')

exports.register = async (req, res, next) => {
    const { fullname, username, password, role } = req.body

    if (!fullname || !username || !password || !role) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await userModel.findOne({ username })
        .then(async user => {
            if (user) return res.json({ status: false, message: 'User already exists' })

            const newUser = new userModel({ fullname, username, password, role })
            await newUser.save()
                .then(() => res.json({ status: true, message: 'Registered' }))
                .catch(next)
        })
        .catch(next)
}

exports.login = async (req, res, next) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await userModel.findOne({ username })
        .then(async user => {
            if (!user) return res.json({ status: false, message: `User don't exist` })

            const isMatch = await user.comparePassword(password)
            if (!isMatch) return res.json({ status: false, message: `Password invalid` })

            const tokenData = { _id: user._id, fullname: user.fullname, username, role: user.role, status: user.status }

            if (user.isAdmin === true) {
                tokenData.isAdmin = true
            }

            const token = jwt.sign(tokenData, 'secretKey', { expiresIn: '2h' })
            res.json({ status: true, message: 'Logged', token })
        })
        .catch(next)
}

exports.getAllStudents = async (req, res, next) => {
    const students = await userModel.find({ role: 2 })
    res.json({ status: true, students })
}

exports.getAllLecturers = async (req, res, next) => {
    const lecturers = await userModel.find({ role: 1 })
    res.json({ status: true, lecturers })
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

exports.getUser = async (req, res, next) => {
    const { username } = req.params

    if (!username) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    const user = await userModel.findOne({ username })
    res.json({ status: true, user })
}