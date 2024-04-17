import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import { socket } from './utils/socket'
import { useGlobal } from './utils/useGlobal'
import Chart from 'chart.js/auto'
import { CategoryScale } from 'chart.js'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'react-toastify/dist/ReactToastify.css'
import 'react-quill/dist/quill.snow.css'
import 'react-quill/dist/quill.bubble.css'
import 'gantt-task-react/dist/index.css'
import './scss/index.scss'

import Login from './pages/Login'
import Lecturer from './pages/Lecturer'
import Home from './pages/Home'
import DetailTopic from './pages/DetailTopic'
import CreateTopic from './pages/CreateTopic'
import Register from './pages/Register'
import Student from './pages/Student'
import CreateTask from './pages/CreateTask'
import Tasks from './pages/Tasks'
import Waiting from './pages/Waiting'
import Account from './pages/Account'
import Profile from './pages/Profile'

import Dashboard from './admin/Dashboard'
import AdminStudents from './admin/AdminStudents'
import AdminLecturers from './admin/AdminLecturers'
import AdminTopics from './admin/AdminTopics'
import AdminProjects from './admin/AdminProjects'
import AdminAccount from './admin/AdminAccount'

Chart.register(CategoryScale)

function App() {
  const [state, dispatch] = useGlobal()
  const token = sessionStorage.getItem('token')

  const navigateWithLecturer = (page) => {
    if (token) {
      return jwtDecode(token).role === 1 && jwtDecode(token).status === true
        ? page
        : <Navigate to="/waiting" />
    }
    return <Navigate to="/login" />
  }

  const navigateWithStudent = (page) => {
    if (token) {
      return jwtDecode(token).role !== 1 && jwtDecode(token).status === true
        ? page
        : <Navigate to="/waiting" />
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
      {token && jwtDecode(token).isAdmin
        ? <Routes>
          <Route index element={<Dashboard />} />
          <Route path='/students' element={<AdminStudents />} />
          <Route path='/lecturers' element={<AdminLecturers />} />
          <Route path='/topics' element={<AdminTopics />} />
          <Route path='/projects' element={<AdminProjects />} />
          <Route path='/account' element={<AdminAccount />} />
          <Route path='/detail-topic/:slug' element={<DetailTopic />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        : <Routes>
          <Route index element={
            token
              ? jwtDecode(token).status === true
                ? jwtDecode(token).isRegistered === true
                  ? <Student />
                  : jwtDecode(token).role === 1
                    ? <Lecturer />
                    : <Home />
                : <Waiting />
              : <Navigate to='/login' />
          } />
          <Route path='/login' element={
            token
              ? jwtDecode(token).status === true
                ? jwtDecode(token).role === 2
                  ? <Navigate to='/student' />
                  : <Navigate to='/lecturer' />
                : <Waiting />
              : <Login />
          } />
          <Route path='/register' element={token ? <Navigate to='/' /> : <Register />} />
          <Route path='/lecturer' element={navigateWithLecturer(<Lecturer />)} />
          <Route path='/create-topic' element={navigateWithLecturer(<CreateTopic />)} />
          <Route path='/update-topic' element={navigateWithLecturer(<CreateTopic />)} />
          <Route path='/create-task' element={navigateWithLecturer(<CreateTask />)} />
          <Route path='/update-task' element={navigateWithLecturer(<CreateTask />)} />
          <Route path='/list-tasks/:username' element={navigateWithLecturer(<Tasks />)} />
          <Route path='/student' element={navigateWithStudent(<Student />)} />
          <Route path='/detail-topic/:slug' element={<DetailTopic />} />
          <Route path='/waiting' element={token ? <Waiting /> : <Navigate to='/' />} />
          <Route path='/account' element={token ? <Account /> : <Navigate to='/' />} />
          <Route path='/profile/:username' element={<Profile />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>}
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
