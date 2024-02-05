const express = require('express')

const {
    getMessages
} = require('../controllers/message.controller')

const router = express.Router()

router.get('/get-messages/:id', getMessages)

module.exports = router
