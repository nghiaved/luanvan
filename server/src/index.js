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

const app = express()

mongoose.connect('mongodb://localhost:27017/luanvan')
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

const server = http.createServer(app)

const io = new Server(server, { cors: { origin: 'http://localhost:3000', methods: ['GET', 'POST'] } })

io.on('connection', socket => {
    socket.on('user-join', username => socket.join(username))
    socket.on('send-notify', username => io.to(username).emit('receive-notify', username))
})

server.listen(8000, () => console.log(`Server's listening at http://localhost:8000`))
