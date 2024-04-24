const express = require('express')

const {
    sendMess, getMesses, readMesses
} = require('../controllers/mess.controller')

const router = express.Router()

router.post('/send-mess', sendMess)
router.get('/get-messes/:register', getMesses)
router.patch('/read-messes', readMesses)

module.exports = router
