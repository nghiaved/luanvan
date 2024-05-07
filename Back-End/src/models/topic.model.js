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
    },
    isActive: {
        type: Boolean,
        default: true
    },
    limit: {
        type: Number,
        default: 4
    },
    registered: {
        type: Number,
        default: 0
    }
})

const Topic = mongoose.models.Topic || mongoose.model('Topic', topicSchema)

module.exports = Topic
