const express = require('express')

const {
    getMessages, readMessage, readAllMessages, deleteMessage, deleteAllMessages
} = require('../controllers/message.controller')

const router = express.Router()

router.get('/get-messages/:id', getMessages)
router.patch('/read-message/:id', readMessage)
router.patch('/read-all-messages/:id', readAllMessages)
router.delete('/delete-message/:id', deleteMessage)
router.delete('/delete-all-messages/:id', deleteAllMessages)

module.exports = router
