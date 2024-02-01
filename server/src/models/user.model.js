const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    fullname: String,
    username: String,
    password: String,
    role: Number
})

userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(this.password, salt)
    this.password = hash
})

userSchema.methods.comparePassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password)
}

const User = mongoose.models.User || mongoose.model('User', userSchema)

module.exports = User
