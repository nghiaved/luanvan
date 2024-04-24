const express = require('express')

const {
    register, login, getUser, updateInfo, changePassword, getTokenById
} = require('../controllers/user.controller')

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/get-user/:username', getUser)
router.put('/update-info/:id', updateInfo)
router.patch('/change-password/:id', changePassword)
router.get('/get-token-by-id/:id', getTokenById)

module.exports = router
