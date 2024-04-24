import AdminLayout from "../components/AdminLayout"
import { useNavigate, useParams } from 'react-router-dom'
import React, { useCallback, useEffect, useState } from "react"
import axios from "axios"
import Progress from '../components/Progress'
import ListTasks from "../components/ListTasks"

export default function AdminTasks() {
    const token = sessionStorage.getItem('token')
    const { username } = useParams()
    const [student, setStudent] = useState({})
    const [tasks, setTasks] = useState([])
    const [grantt, setGrantt] = useState({})
    const navigate = useNavigate()

    const fetchTasks = useCallback(async () => {
        await axios.get(`http://localhost:8000/api/tasks/get-tasks-by-student/${student._id}`)
            .then(res => {
                if (res.data.status === true) {
                    setTasks(res.data.tasks)
                    let totalCompleted = 0
                    const initGrantt = res.data.tasks.map(task => {
                        if (task.status === true) ++totalCompleted
                        return {
                            start: new Date(task.start),
                            end: new Date(task.end),
                            name: task.title,
                            progress: task.points || 0,
                            id: task._id,
                            task
                        }
                    })
                    setGrantt({
                        data: initGrantt,
                        totalCount: initGrantt.length,
                        totalCompleted
                    })
                }
            })
            .catch(err => console.log(err))
    }, [student._id])

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`http://localhost:8000/api/users/get-user/${username}`)
            setStudent(res.data.user)
        }
        fetchUser()

        if (student._id) {
            fetchTasks()
        }
    }, [fetchTasks, token, username, student._id])

    return (
        <AdminLayout breadcrumb='Danh sách công việc'>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Sinh viên: "{student.fullname}"</h3>
                <button className='btn btn-secondary' onClick={() => navigate(-1)}>Trở lại</button>
            </div>
            {tasks.length > 0 ? <>
                <ul className="nav nav-tabs nav-tabs-bordered">
                    <li className="nav-item mt-2">
                        <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#overview">Tổng quan</button>
                    </li>
                    <li className="nav-item mt-2">
                        <button className="nav-link" data-bs-toggle="tab" data-bs-target="#list-tasks">Danh sách công việc</button>
                    </li>
                </ul>
                <div className="tab-content pt-4">
                    <div className="tab-pane fade show active" id="overview">
                        <h3>Tiến độ thực hiện</h3>
                        <div className="row my-4">
                            <Progress data={grantt.data} isAdmin />
                            <div className="mt-2 text-end">
                                <b className='me-2'>Tổng số công việc hoàn thành:</b>
                                <i>{grantt.totalCompleted}/{grantt.totalCount}</i>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade show" id="list-tasks">
                        <ListTasks data={tasks} student={student} isAdmin />
                    </div>
                </div>
            </> : (
                <div className="my-4">Sinh viên chưa có công việc nào.</div>
            )}
        </AdminLayout>
    )
}
