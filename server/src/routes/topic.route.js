const express = require('express')

const {
    createTopic, getTopicsByLecturer, getAllTopics, getTopicBySlug, updateTopic, deleteTopic, acceptTopic, refuseTopic
} = require('../controllers/topic.controller')

const router = express.Router()

router.post('/create-topic', createTopic)
router.get('/get-topics-by-lecturer/:lecturer', getTopicsByLecturer)
router.get('/get-all-topics', getAllTopics)
router.get('/get-topic-by-slug/:slug', getTopicBySlug)
router.put('/update-topic/:id', updateTopic)
router.delete('/delete-topic/:id', deleteTopic)
router.patch('/accept-topic/:id', acceptTopic)
router.delete('/refuse-topic/:id', refuseTopic)

module.exports = router
