const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const userRoute = require('./routes/user.route')
const topicRoute = require('./routes/topic.route')
const registerRoute = require('./routes/register.route')
const taskRoute = require('./routes/task.route')

const app = express()

mongoose.connect('mongodb://localhost:27017/luanvan')
    .then(() => console.log('Database connection successful!'))
    .catch(err => console.log(err))

app.use(cors())
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000
}))

app.use('/api/users', userRoute)
app.use('/api/topics', topicRoute)
app.use('/api/registers', registerRoute)
app.use('/api/tasks', taskRoute)

app.listen(8000, () => console.log(`Server's listening at http://localhost:8000`))
