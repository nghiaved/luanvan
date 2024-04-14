import React, { useRef } from 'react'
import axios from 'axios'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Layout from '../components/Layout'
import ReactQuill from 'react-quill'
import { socket } from '../utils/socket'
import { jwtDecode } from 'jwt-decode'

export default function CreateTask() {
    const navigate = useNavigate()
    const location = useLocation()
    const { student, task } = location.state
    const quillRef = useRef(null)

    const handleAssignTask = async (e) => {
        e.preventDefault()
        const description = quillRef.current.value
        if (!description
            .replaceAll("<p>", "").replaceAll("</p>", "")
            .replaceAll("<br>", "").replaceAll("<br/>", "").trim())
            return toast.error('Vui lòng thêm mô tả công việc')

        const token = sessionStorage.getItem('token')
        const data = {
            title: e.target.title.value,
            description,
            start: e.target.start.value,
            end: e.target.end.value,
            student: student._id,
            lecturer: jwtDecode(token)._id
        }
        await axios.post('http://localhost:8000/api/tasks/create-task', data)
            .then(res => {
                if (res.data.status === true) {
                    socket.emit('send-notify', student.username)
                    toast.success(res.data.message)
                    navigate('/list-tasks', { state: student })
                }
            })
            .catch(err => console.log(err))
    }

    const handleUpdateTask = async (e) => {
        e.preventDefault()
        const description = quillRef.current.value
        if (!description
            .replaceAll("<p>", "").replaceAll("</p>", "")
            .replaceAll("<br>", "").replaceAll("<br/>", "").trim())
            return toast.error('Vui lòng thêm mô tả công việc')

        const data = {
            title: e.target.title.value,
            description,
            start: e.target.start.value,
            end: e.target.end.value,
        }
        await axios.put(`http://localhost:8000/api/tasks/update-task/${task._id}`, data)
            .then(res => {
                if (res.data.status === true) {
                    toast.success(res.data.message)
                    navigate('/list-tasks', { state: student })
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <Layout>
            <h3>{task ? 'Cập nhật' : 'Phân công'} đến "{student.fullname}"</h3>
            <form className='mt-4' onSubmit={task ? handleUpdateTask : handleAssignTask}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Tên công việc</label>
                    <input type="text" className="form-control" id="title" name="title"
                        defaultValue={task?.title} autoComplete="off" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Mô tả công việc</label>
                    <ReactQuill defaultValue={task?.description} ref={quillRef} theme="snow" />
                </div>
                <div className="row mb-3">
                    <div className="col">
                        <label htmlFor="start" className="form-label">Ngày bắt đầu</label>
                        <input defaultValue={new Date(task?.start || Date.now()).toISOString().substring(0, 10)}
                            name="start" required id="start" className="form-control" type="date" />
                    </div>
                    <div className="col">
                        <label htmlFor="end" className="form-label">Ngày kết thúc</label>
                        <input defaultValue={new Date(task?.end || new Date().setDate(new Date().getDate() + 7)).toISOString().substring(0, 10)}
                            name="end" required id="end" className="form-control" type="date" />
                    </div>
                </div>
                <button className='btn btn-primary' type='submit'>{task ? 'Cập nhật' : 'Phân công'}</button>
                <button type='reset' className='btn btn-secondary ms-2' onClick={() => navigate(-1)}>Trở lại</button>
            </form>
        </Layout>
    )
}
