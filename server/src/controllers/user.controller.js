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

            const tokenData = { _id: user._id, fullname: user.fullname, username, role: user.role }
            const token = jwt.sign(tokenData, 'secretKey', { expiresIn: '2h' })
            res.json({ status: true, message: 'Logged', token })
        })
        .catch(next)
}
