import React, { useCallback, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import { useGlobal } from '../utils/useGlobal'
import Progress from '../components/Progress'
import ListTasks from '../components/ListTasks'
import TopicInfo from '../components/TopicInfo'

export default function Student() {
    const [register, setRegister] = useState(null)
    const [tasks, setTasks] = useState([])
    const [grantt, setGrantt] = useState([])
    const [fetchAgain, setFetchAgain] = useState(false)
    const [state] = useGlobal()
    const navigate = useNavigate()

    const fetchApi = useCallback(async () => {
        const token = sessionStorage.getItem('token')
        await axios.get('http://localhost:8000/api/registers/get-register-by-student/' + jwtDecode(token)._id)
            .then(async resRegister => {
                if (resRegister.data.status === true) {
                    const isRegistered = resRegister.data.register
                    if (!isRegistered) {
                        navigate('/')
                    } else {
                        setRegister(isRegistered)
                    }

                    if (isRegistered) {
                        await axios.get('http://localhost:8000/api/tasks/get-tasks-by-student-lecturer', {
                            params: {
                                student: jwtDecode(token)._id,
                                lecturer: isRegistered.lecturer._id
                            }
                        })
                            .then(resTasks => {
                                if (resTasks.data.status === true) {
                                    setTasks(resTasks.data.tasks)
                                    const initGrantt = resTasks.data.tasks.map(task => ({
                                        start: new Date(task.start),
                                        end: new Date(task.end),
                                        name: task.title,
                                        progress: task.points || 0,
                                        id: task._id,
                                        task
                                    }))
                                    setGrantt(initGrantt)
                                }
                            })
                            .catch(err => console.log(err))
                    }
                }
            })
            .catch(err => console.log(err))
    }, [navigate])

    useEffect(() => {
        if (state.fetchAgain !== fetchAgain) {
            setFetchAgain(state.fetchAgain)
        }

        fetchApi()
    }, [fetchApi, fetchAgain, state.fetchAgain])

    return (
        <Layout>
            {register && <>
                <h3 className='mb-4'>Đề tài đăng ký</h3>
                <TopicInfo title={register.topic?.title} desc={register.topic?.description} lecturer={register.lecturer} />
                <div className='mb-2'>
                    <b className='me-2'>Trạng thái:</b>
                    <span className={`${register.status ? 'text-success' : 'text-warning'}`}>
                        {register.status ? 'Đã xác nhận' : 'Chờ xác nhận'}
                    </span>
                </div>
                {register.status === false ? <></> : tasks.length > 0 ? <>
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
                            <h3 className='mb-4'>Tiến độ thực hiện</h3>
                            <Progress data={grantt} />
                        </div>
                        <div className="tab-pane fade show" id="list-tasks">
                            <ListTasks data={tasks} />
                        </div>
                    </div>
                    {register.final === undefined || register.final === null ? <></> : register.final === true ? (
                        <h3 className='text-success mt-4'>Đề tài của bạn đã hoàn thành!</h3>
                    ) : (
                        <h3 className='text-danger mt-4'>Đề tài của bạn đã bị chấm dứt!</h3>
                    )}
                </> : (
                    <div className="mt-4">Bạn chưa có công việc nào.</div>
                )}
            </>}
        </Layout>
    )
}
