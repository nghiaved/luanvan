import React, { useCallback, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import ReactQuill from 'react-quill'
import { Link } from 'react-router-dom'
import { useGlobal } from '../utils/useGlobal'

export default function Student() {
    const [register, setRegister] = useState(null)
    const [tasks, setTasks] = useState([])
    const [fetchAgain, setFetchAgain] = useState(false)
    const [state] = useGlobal()

    const fetchApi = useCallback(async () => {
        const token = sessionStorage.getItem('token')
        await axios.get('http://localhost:8000/api/registers/get-register-by-student/' + jwtDecode(token)._id)
            .then(async resRegister => {
                if (resRegister.data.status === true) {
                    setRegister(resRegister.data.register)

                    if (resRegister.data.register) {
                        await axios.get('http://localhost:8000/api/tasks/get-tasks-by-student-lecturer', {
                            params: {
                                student: jwtDecode(token)._id,
                                lecturer: resRegister.data.register.lecturer._id
                            }
                        })
                            .then(resTasks => {
                                if (resTasks.data.status === true) {
                                    setTasks(resTasks.data.tasks)
                                }
                            })
                            .catch(err => console.log(err))
                    }
                }
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if (state.fetchAgain !== fetchAgain) {
            setFetchAgain(state.fetchAgain)
        }

        fetchApi()
    }, [fetchApi, fetchAgain, state.fetchAgain])

    const timeRemaining = (date) => {
        const timeRemaining = new Date(date).getTime() - Date.now()
        let days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
        return ++days > 0 ? `Còn ${days} ngày` : 'Đã hết hạn'
    }

    return (
        <Layout>
            {register ? <>
                <div className='display-6 mb-4'>Đề tài đăng ký</div>
                <div className='mb-2'>
                    <b className='me-2'>Tên đề tài:</b>
                    <i>{register.topic?.title}</i>
                </div>
                <div className="accordion mb-2">
                    <div className="accordion-item">
                        <h2 className="accordion-header" id="descriptionHeading">
                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#descriptionTopic" aria-expanded="true" aria-controls="descriptionTopic">
                                Mô tả đề tài
                            </button>
                        </h2>
                        <div id="descriptionTopic" className="accordion-collapse collapse show" aria-labelledby="descriptionHeading" data-bs-parent="#accordionExample">
                            <div className="accordion-body">
                                <ReactQuill value={register.topic?.description} readOnly theme="bubble" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mb-2'>
                    <b className='me-2'>Giảng viên hướng dẫn:</b>
                    <i>{register.lecturer?.username}</i>
                </div>
                <div className='mb-2'>
                    <b className='me-2'>Trạng thái:</b>
                    <span className={`${register.status ? 'text-success' : 'text-warning'}`}>
                        {register.status ? 'Đã xác nhận' : 'Chờ xác nhận'}
                    </span>
                </div>
                {register.status === false ? <></> : tasks.length > 0 ? <>
                    <div className='display-6 mb-4'>Danh sách công việc</div>
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
                                            ? <span className='text-success'>Đã nộp {task.points && `(${task.points}đ)`}</span>
                                            : <span className='text-danger'>{timeRemaining(task.end)}</span>}
                                    </td>
                                    <td>
                                        <Link state={task} to={`/detail-task`}>Chi tiết</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {register.final === undefined || register.final === null ? <></> : register.final === true ? (
                        <div className='display-6 text-success'>Đề tài của bạn đã hoàn thành!</div>
                    ) : (
                        <div className='display-6 text-danger'>Đề tài của bạn đã bị chấm dứt!</div>
                    )}
                </> : (
                    <div className="mt-4">Bạn chưa có công việc nào.</div>
                )}
            </> : (
                <div className='mt-4'>Bạn chưa đăng ký đề tài nào.</div>
            )}
        </Layout>
    )
}
