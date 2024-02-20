const express = require('express')

const {
    createRegister, getRegistersByLecturer, acceptRegister, refuseRegister,
    getRegister, getRegisterByStudent, getAllRegisters, finalTopic
} = require('../controllers/register.controller')

const router = express.Router()

router.post('/create-register', createRegister)
router.get('/get-registers-by-lecturer/:lecturer', getRegistersByLecturer)
router.patch('/accept-register/:id', acceptRegister)
router.delete('/refuse-register/:id', refuseRegister)
router.get('/get-register', getRegister)
router.get('/get-register-by-student/:student', getRegisterByStudent)
router.get('/get-all-registers', getAllRegisters)
router.patch('/final-topic/:student', finalTopic)

module.exports = router
