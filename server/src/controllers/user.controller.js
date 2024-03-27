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
            } else {
                tokenData.isRegistered = user.isRegistered
            }

            const token = jwt.sign(tokenData, 'secretKey', { expiresIn: '2h' })
            res.json({ status: true, message: 'Logged', token })
        })
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

exports.updateInfo = async (req, res, next) => {
    const _id = req.params.id

    if (!_id) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    await userModel.findByIdAndUpdate(_id, req.body)
        .then(() => res.json({ status: true, message: 'Updated' }))
        .catch(next)
}

exports.changePassword = async (req, res, next) => {
    const _id = req.params.id
    const { password, newPassword } = req.body

    if (!_id || !password || !newPassword) {
        return res.json({ status: false, message: 'Not enough information' })
    }

    const user = await userModel.findById(_id)
    const isMatch = await user.comparePassword(password)
    if (!isMatch) return res.json({ status: false, message: `Current password is incorrect` })

    await userModel.updateOne({ _id }, { password: newPassword })
        .then(() => res.json({ status: true, message: 'Changed' }))
        .catch(next)
}

exports.getTokenById = async (req, res, next) => {
    await userModel.findById(req.params.id)
        .then(user => {
            const tokenData = { _id: user._id, fullname: user.fullname, username: user.username, role: user.role, status: user.status }
            const token = jwt.sign(tokenData, 'secretKey', { expiresIn: '2h' })
            res.json({ status: true, message: 'Refreshed', token })
        })
        .catch(next)
}