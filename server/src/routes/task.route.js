const express = require('express')

const {
    createTask, getTasksByStudentLecturer
} = require('../controllers/task.controller')

const router = express.Router()

router.post('/create-task', createTask)
router.get('/get-tasks-by-student-lecturer', getTasksByStudentLecturer)

module.exports = router
