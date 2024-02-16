const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)

const topicSchema = new mongoose.Schema({
    title: String,
    description: String,
    slug: {
        type: String,
        slug: 'title',
        unique: true
    },
    lecturer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: Boolean,
        default: false
    }
})

const Topic = mongoose.models.Topic || mongoose.model('Topic', topicSchema)

module.exports = Topic
