const express = require('express')

const {
    createRegister, getRegistersByLecturer, acceptRegister, refuseRegister, getRegister, getRegisterByStudent
} = require('../controllers/register.controller')

const router = express.Router()

router.post('/create-register', createRegister)
router.get('/get-registers-by-lecturer/:lecturer', getRegistersByLecturer)
router.patch('/accept-register/:id', acceptRegister)
router.delete('/refuse-register/:id', refuseRegister)
router.get('/get-register', getRegister)
router.get('/get-register-by-student/:student', getRegisterByStudent)

module.exports = router
