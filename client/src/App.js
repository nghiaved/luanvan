import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import './scss/index.scss'
import Login from './pages/Login'
import ListTopics from './pages/ListTopics'
import Home from './pages/Home'
import DetailTopic from './pages/DetailTopic'
import CreateTopic from './pages/CreateTopic'
import Register from './pages/Register'
import ListRegisters from './pages/ListRegisters'
import Student from './pages/Student'
import CreateTask from './pages/CreateTask'
import ListTasks from './pages/ListTasks'
import DetailTask from './pages/DetailTask'
import Statistics from './pages/Statistics'
import { ToastContainer } from 'react-toastify'
import { socket } from './utils/socket'
import { useGlobal } from './utils/useGlobal'
import { useEffect } from 'react'

function App() {
  const [state, dispatch] = useGlobal()
  const token = sessionStorage.getItem('token')

  const navigateWithToken = (page) => {
    if (token) {
      return jwtDecode(token).role === 1
        ? page
        : <Navigate to="/" />
    }
    return <Navigate to="/login" />
  }

  useEffect(() => {
    if (token) {
      socket.emit('user-join', jwtDecode(token).username)
      socket.on('receive-notify', (username) => {
        if (username === jwtDecode(token).username) {
          dispatch({ fetchAgain: !state.fetchAgain })
        }
      })
    }
  }, [dispatch, state.fetchAgain, token])

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path='/login' element={token ? <Navigate to='/' /> : <Login />} />
        <Route path='/register' element={token ? <Navigate to='/' /> : <Register />} />
        <Route path='/list-topics' element={navigateWithToken(<ListTopics />)} />
        <Route path='/create-topic' element={navigateWithToken(<CreateTopic />)} />
        <Route path='/update-topic' element={navigateWithToken(<CreateTopic />)} />
        <Route path='/list-registers' element={navigateWithToken(<ListRegisters />)} />
        <Route path='/create-task' element={navigateWithToken(<CreateTask />)} />
        <Route path='/list-tasks' element={navigateWithToken(<ListTasks />)} />
        <Route path='/student' element={token ? <Student /> : <Navigate to='/' />} />
        <Route path='/detail-task' element={token ? <DetailTask /> : <Navigate to='/' />} />
        <Route path='/statistics' element={<Statistics />} />
        <Route path='/detail-topic/:slug' element={<DetailTopic />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
