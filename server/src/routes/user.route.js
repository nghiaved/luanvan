const express = require('express')

const {
    register, login, getAllStudents, getAllLecturers
} = require('../controllers/user.controller')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/get-all-students', getAllStudents)
router.get('/get-all-lecturers', getAllLecturers)

module.exports = router
