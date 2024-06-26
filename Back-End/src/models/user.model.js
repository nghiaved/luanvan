const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    fullname: String,
    username: String,
    password: String,
    role: Number,
    status: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isRegistered: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    birth: String,
    sex: String,
    grade: String,
    major: String,
    course: String,
    faculty: String,
    email: String,
    phone: String,
    avatar: String,
    isOnline: {
        type: Boolean,
        default: false
    },
})

const hashPassword = async function () {
    let user = {}
    this._id != null ? user = this : user = this._update
    if (user.password) {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(user.password, salt)
        user.password = hash
    }
}

userSchema.pre('save', hashPassword)

userSchema.pre('updateOne', hashPassword)

userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password)
}

const User = mongoose.models.User || mongoose.model('User', userSchema)

module.exports = User
