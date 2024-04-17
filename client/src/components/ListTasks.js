import React, { useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import ModalConfirm from '../components/ModalConfirm'
import convertDesc from '../utils/convertDesc'
import { toast } from 'react-toastify'
import DetailTask from './DetailTask'

export default function ListTasks({ data, student }) {
    const token = sessionStorage.getItem('token')
    const [tasks, setTasks] = useState(data)
    const [taskDetail, setTaskDetail] = useState(data[0])
    const [taskId, setTaskId] = useState(null)

    const timeRemaining = (date) => {
        const timeRemaining = new Date(date).getTime() - Date.now()
        let days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
        return ++days > 0 ? `Còn ${days} ngày` : 'Đã hết hạn'
    }

    const handleDeleteTask = async () => {
        await axios.delete(`http://localhost:8000/api/tasks/delete-task/${taskId}`)
            .then(res => {
                if (res.data.status === true) {
                    toast.success(res.data.message)
                    const newTasks = tasks.filter(task => task._id !== taskId)
                    setTasks(newTasks)
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            <h3>Danh sách công việc</h3>
            <div className="row my-4">
                {tasks.map(task => (
                    <div key={task._id} className='col-lg-6 mb-4'>
                        <div onClick={() => setTaskDetail(task)}
                            className={`card ${task._id === taskDetail._id && 'bg-light'}`}
                            style={{ cursor: 'pointer' }}>
                            <div className="card-header">
                                <div className="d-flex justify-content-between">
                                    <b className={`${task._id === taskDetail._id && 'text-primary'}`}>{task.title}</b>
                                    <div className="card-text">
                                        {task.status
                                            ? <span className='text-success'>Đã nộp {task.points && `(${task.points}%)`} </span>
                                            : <span className='text-danger'>{timeRemaining(task.end)}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <p className="card-text">{convertDesc(task.description)}</p>
                                <hr />
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div>{task.start.substring(0, 10)} | {task.end.substring(0, 10)}</div>
                                    <div>
                                        {jwtDecode(token).role === 1 && <>
                                            <Link className="mx-4" state={{ task, student }} to='/update-task'>
                                                <i className="bi bi-pencil-square text-warning"></i>
                                            </Link>
                                            <Link data-bs-toggle="modal" data-bs-target='#refuseModal' onClick={() => setTaskId(task._id)}>
                                                <i className="bi bi-trash-fill text-danger"></i>
                                            </Link>
                                        </>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <DetailTask data={taskDetail} />
            <ModalConfirm
                id='refuseModal'
                action='Xoá'
                type='danger'
                title='Xoá công việc'
                content='Bạn có chắc chắn muốn xoá công việc này?'
                func={handleDeleteTask}
            />
        </>
    )
}
