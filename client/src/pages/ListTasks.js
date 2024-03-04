import Layout from "../components/Layout"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import React, { useCallback, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import axios from "axios"

export default function ListTasks() {
    const token = sessionStorage.getItem('token')
    const location = useLocation()
    const student = location.state
    const [tasks, setTasks] = useState([])
    const navigate = useNavigate()

    const fetchTasks = useCallback(async (userId) => {
        await axios.get('http://localhost:8000/api/tasks/get-tasks-by-student-lecturer', {
            params: {
                student: student._id,
                lecturer: userId
            }
        })
            .then(res => {
                if (res.data.status === true) {
                    setTasks(res.data.tasks)
                }
            })
            .catch(err => console.log(err))
    }, [student._id])

    useEffect(() => {
        fetchTasks(jwtDecode(token)._id)
    }, [fetchTasks, token])

    const timeRemaining = (date) => {
        const timeRemaining = new Date(date).getTime() - Date.now()
        let days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
        return ++days > 0 ? `Còn ${days} ngày` : 'Đã hết hạn'
    }

    const convertDesc = desc => {
        desc = desc.replace(/<[^>]*>/g, " ")
        if (desc.length < 50) return desc
        desc = desc.substring(0, 50).concat(" ...")
        return desc
    }

    return (
        <Layout>
            <Link state={student} to="/create-task" className="me-4">Thêm công việc</Link>
            <Link to="/list-registers">Danh sách đăng ký</Link>
            <div className='display-6 mt-4'>Công việc của "{student.fullname}"</div>
            {tasks.length > 0 ? <>
                <div className="row mt-4">
                    {tasks.map(task => (
                        <div key={task._id} className='col-lg-6 mb-4'>
                            <div className="card">
                                <div className="card-header">
                                    <div className="d-flex justify-content-between">
                                        <b>{task.title}</b>
                                        <div className="card-text">
                                            {task.status
                                                ? <span className='text-success'>Đã nộp {task.points && `(${task.points}đ)`} </span>
                                                : <span className='text-danger'>{timeRemaining(task.end)}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <p className="card-text">
                                        {convertDesc(task.description)}
                                    </p>
                                    <p className='text-end'>
                                        <Link state={task} to={`/detail-task`}>Chi tiết</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <Link state={{ tasks, student }} to='/statistics'>
                    <button className="btn btn-primary">
                        Thống kê
                    </button>
                </Link>
                <button className='btn btn-secondary ms-2' onClick={() => navigate(-1)}>Trở lại</button>
            </> : (
                <div className="mt-4">Bạn chưa thêm công việc nào.</div>
            )}
        </Layout>
    )
}
