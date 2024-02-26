const express = require('express')

const {
    register, login, getAllStudents, getAllLecturers, acceptUser, refuseUser, getUser
} = require('../controllers/user.controller')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/get-all-students', getAllStudents)
router.get('/get-all-lecturers', getAllLecturers)
router.patch('/accept-user/:id', acceptUser)
router.delete('/refuse-user/:id', refuseUser)
router.get('/get-user/:username', getUser)

module.exports = router
