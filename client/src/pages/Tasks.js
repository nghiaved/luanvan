import Layout from "../components/Layout"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import React, { useCallback, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { toast } from 'react-toastify'
import { socket } from '../utils/socket'
import Progress from '../components/Progress'
import ListTasks from "../components/ListTasks"
import ButtonModalConfirm from "../components/ButtonModalConfirm"

export default function Tasks() {
    const token = sessionStorage.getItem('token')
    const location = useLocation()
    const student = location.state
    const [tasks, setTasks] = useState([])
    const [grantt, setGrantt] = useState({})
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
        fetchTasks(jwtDecode(token)._id)
    }, [fetchTasks, token])

    const handleFinal = async (final) => {
        const res = await axios.patch(`http://localhost:8000/api/registers/final-topic/${student._id}`, { final })
        if (res.data.status === true) {
            socket.emit('send-notify', student.username)
            toast.success(res.data.message)
        }
    }

    return (
        <Layout breadcrumb='Danh sách công việc'>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Sinh viên: "{student.fullname}"</h3>
                <div className="text-end">
                    <Link state={{ student }} to="/create-task" className="me-4">Thêm công việc</Link>
                    <Link to="/lecturer">Danh sách đề tài</Link>
                </div>
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
                            <Progress data={grantt.data} />
                            <div className="mt-2 text-end">
                                <b className='me-2'>Tổng số công việc hoàn thành:</b>
                                <i>{grantt.totalCompleted}/{grantt.totalCount}</i>
                            </div>
                        </div>
                    </div>
                    <div className="tab-pane fade show" id="list-tasks">
                        <ListTasks data={tasks} student={student} />
                    </div>
                </div>
                <ButtonModalConfirm
                    id='finishModal'
                    action='Hoàn thành'
                    type='primary'
                    title='Hoàn thành đề tài'
                    content='Bạn có chắc chắn muốn hoàn thành đề tài này?'
                    func={() => handleFinal(true)}
                />
                <ButtonModalConfirm
                    id='terminateModal'
                    action='Kết thúc'
                    type='danger'
                    title='Kết thúc đề tài'
                    content='Bạn có chắc chắn muốn kết thúc đề tài này?'
                    func={() => handleFinal(false)}
                />
                <button className='btn btn-secondary ms-2' onClick={() => navigate(-1)}>Trở lại</button>
            </> : (
                <div className="mt-4">Bạn chưa thêm công việc nào.</div>
            )}
        </Layout>
    )
}
