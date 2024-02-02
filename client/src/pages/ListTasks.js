import Layout from "../components/Layout"
import { Link, useLocation } from 'react-router-dom'
import React, { useCallback, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import axios from "axios"

export default function ListTasks() {
    const token = sessionStorage.getItem('token')
    const location = useLocation()
    const student = location.state
    const [tasks, setTasks] = useState([])

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

    return (
        <Layout>
            <Link state={student} to="/create-task" className="me-4">Thêm công việc</Link>
            <Link to="/list-registers">Danh sách đăng ký</Link>
            <div className='display-6 mt-4'>Công việc của "{student.fullname}"</div>
            {tasks.length > 0 ? <>
                <table className="table table-hover mt-4">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tên công việc</th>
                            <th scope="col">Ngày bắt đầu</th>
                            <th scope="col">Ngày kết thúc</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {tasks.map((task, index) => (
                            <tr key={task._id}>
                                <th scope="row">{++index}</th>
                                <td>{task.title}</td>
                                <td>{task.start.substring(0, 10)}</td>
                                <td>{task.end.substring(0, 10)}</td>
                                <td>
                                    {task.status
                                        ? <span className='text-success'>Đã nộp</span>
                                        : <span className='text-danger'>{timeRemaining(task.end)}</span>}
                                </td>
                                <td>
                                    <Link state={task} to={`/detail-task`}>Chi tiết</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </> : (
                <div className="mt-4">Bạn chưa thêm công việc nào.</div>
            )}
        </Layout>
    )
}
