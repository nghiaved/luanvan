const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')

const userRoute = require('./routes/user.route')
const topicRoute = require('./routes/topic.route')
const registerRoute = require('./routes/register.route')
const taskRoute = require('./routes/task.route')
const fileRoute = require('./routes/file.route')
const messageRoute = require('./routes/message.route')
const messRoute = require('./routes/mess.route')
const adminRoute = require('./routes/admin.route')

require('dotenv').config()

const app = express()

mongoose.connect(process.env.MONGODB)
    .then(() => console.log('Database connection successful!'))
    .catch(err => console.log(err))

app.use(express.static(path.join(__dirname, 'uploads')))
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
app.use('/api/files', fileRoute)
app.use('/api/messages', messageRoute)
app.use('/api/messes', messRoute)
app.use('/api/admin', adminRoute)

const server = http.createServer(app)

const io = new Server(server, { cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] } })

const userModel = require('./models/user.model')

io.on('connection', socket => {
    socket.on('user-join', async username => {
        socket.join(username)
        await userModel.updateOne({ username }, { isOnline: true })

        socket.on('disconnect', async () => {
            await userModel.updateOne({ username }, { isOnline: false })
        })
    })
    socket.on('send-notify', username => io.to(username).emit('receive-notify', username))
})

server.listen(process.env.PORT, () => console.log(`Server's listening at http://localhost:${process.env.PORT}`))
