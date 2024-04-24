const express = require('express')

const {
    createTask, getTasksByStudentLecturer, getTasksByStudent, extendTask, evaluateTask, updateTask, deleteTask
} = require('../controllers/task.controller')

const router = express.Router()

router.post('/create-task', createTask)
router.get('/get-tasks-by-student-lecturer', getTasksByStudentLecturer)
router.get('/get-tasks-by-student/:student', getTasksByStudent)
router.patch('/extend-task/:id', extendTask)
router.patch('/evaluate-task/:id', evaluateTask)
router.put('/update-task/:id', updateTask)
router.delete('/delete-task/:id', deleteTask)

module.exports = router
