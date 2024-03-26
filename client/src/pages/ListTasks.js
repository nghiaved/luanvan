import Layout from "../components/Layout"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import React, { useCallback, useEffect, useState } from "react"
import { ViewMode, Gantt } from "gantt-task-react";
import { jwtDecode } from "jwt-decode"
import axios from "axios"
import { toast } from 'react-toastify'
import { socket } from '../utils/socket'

export default function ListTasks() {
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

    const handleFinal = async (final) => {
        const res = await axios.patch(`http://localhost:8000/api/registers/final-topic/${student._id}`, { final })
        if (res.data.status === true) {
            socket.emit('send-notify', student.username)
            toast.success(res.data.message)
        }
    }

    return (
        <Layout>
            <Link state={student} to="/create-task" className="me-4">Thêm công việc</Link>
            <Link to="/list-topics">Danh sách đề tài</Link>
            <h4 className='mt-4'>Sinh viên: "{student.fullname}"</h4>
            {tasks.length > 0 ? <>
                <div className="row my-4">
                    <Gantt
                        tasks={grantt.data}
                        onClick={(data) => navigate('/detail-task', { state: data.task })}
                        viewMode={ViewMode.Week}
                        listCellWidth=""
                        columnWidth={100}
                        rowHeight={50}
                        barBackgroundColor="#1c57a5"
                        barProgressColor="#198754"
                        fontSize={16}
                    />
                    <div className="mt-2 text-end">
                        <b className='me-2'>Tổng số công việc hoàn thành:</b>
                        <i>{grantt.totalCompleted}/{grantt.totalCount}</i>
                    </div>
                </div>
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
                <button className='btn btn-primary me-2' data-bs-toggle="modal" data-bs-target="#finishModal">Hoàn thành</button>
                <div className="modal fade" id="finishModal" tabIndex="-1" aria-labelledby="finishModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="terminateModalLabel">Hoàn thành đề tài</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Bạn có chắc chắn muốn hoàn thành đề tài này?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Trở lại</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleFinal(true)}>Hoàn thành</button>
                            </div>
                        </div>
                    </div>
                </div>
                <button className='btn btn-danger me-2' data-bs-toggle="modal" data-bs-target="#terminateModal">Kết thúc</button>
                <div className="modal fade" id="terminateModal" tabIndex="-1" aria-labelledby="terminateModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="terminateModalLabel">Kết thúc đề tài</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Bạn có chắc chắn muốn kết thúc đề tài này?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Trở lại</button>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => handleFinal(false)}>Kết thúc</button>
                            </div>
                        </div>
                    </div>
                </div>
                <button className='btn btn-secondary ms-2' onClick={() => navigate(-1)}>Trở lại</button>
            </> : (
                <div className="mt-4">Bạn chưa thêm công việc nào.</div>
            )}
        </Layout>
    )
}
