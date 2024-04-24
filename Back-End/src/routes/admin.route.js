const express = require('express')

const {
    getHome, getAllStudents, getAllLecturers, getAllTopics, getAllRegisters,
    acceptUser, refuseUser, acceptTopic, refuseTopic
} = require('../controllers/admin.controller')

const router = express.Router()

router.get('/get-home', getHome)
router.get('/get-all-students', getAllStudents)
router.get('/get-all-lecturers', getAllLecturers)
router.get('/get-all-topics', getAllTopics)
router.get('/get-all-registers', getAllRegisters)
router.patch('/accept-user/:id', acceptUser)
router.delete('/refuse-user/:id', refuseUser)
router.patch('/accept-topic/:id', acceptTopic)
router.delete('/refuse-topic/:id', refuseTopic)

module.exports = router
