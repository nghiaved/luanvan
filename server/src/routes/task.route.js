const express = require('express')

const {
    createTask, getTasksByStudentLecturer, extendTask
} = require('../controllers/task.controller')

const router = express.Router()

router.post('/create-task', createTask)
router.get('/get-tasks-by-student-lecturer', getTasksByStudentLecturer)
router.patch('/extend-task/:id', extendTask)

module.exports = router
