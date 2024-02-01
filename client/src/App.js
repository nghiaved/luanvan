import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
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
import Gantt from './pages/Gantt'
import { ToastContainer } from 'react-toastify'

function App() {
  const token = sessionStorage.getItem('token')
  const navigateWithToken = (page) => {
    if (token) {
      return jwtDecode(token).role === 1
        ? page
        : <Navigate to="/" />
    }
    return <Navigate to="/login" />
  }

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
        <Route path='/gantt' element={<Gantt />} />
        <Route path='/detail-topic/:slug' element={<DetailTopic />} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  )
}

export default App
