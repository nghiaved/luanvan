import Layout from '../components/Layout'
import axios from 'axios'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'
import { socket } from '../utils/socket'
import { useGlobal } from '../utils/useGlobal'
import Progress from '../components/Progress'
import TopicInfo from '../components/TopicInfo'
import ButtonModalConfirm from '../components/ButtonModalConfirm'

export default function DetailTopic() {
    const token = sessionStorage.getItem('token')
    const location = useLocation()
    const [topic, setTopic] = useState(location.state)
    const navigate = useNavigate()
    const { slug } = useParams()
    const [register, setRegister] = useState(null)
    const [students, setStudents] = useState([])
    const [state] = useGlobal()
    const [fetchAgain, setFetchAgain] = useState(false)

    useEffect(() => {
        if (state.fetchAgain !== fetchAgain) {
            setFetchAgain(state.fetchAgain)
        }

        if (!topic) {
            const fetchTopic = async () => {
                const res = await axios.get('http://localhost:8000/api/topics/get-topic-by-slug/' + slug)
                setTopic(res.data.topic)
            }
            fetchTopic()
        }

        if (token && topic && jwtDecode(token).role !== 1) {
            const fetchRegister = async () => {
                const res = await axios.get(`http://localhost:8000/api/registers/get-register?topic=${topic._id}&student=${jwtDecode(token)._id}`)
                if (res.data.register?.status === undefined) {
                    setRegister(null)
                } else {
                    setRegister(res.data.register?.status)
                }
            }
            fetchRegister()
        }

        if (token && topic && jwtDecode(token).role === 1) {
            const fetchStudents = async () => {
                const res = await axios.get(`http://localhost:8000/api/registers/get-registers?topic=${topic._id}&lecturer=${jwtDecode(token)._id}`)
                if (res.data.registers.length > 0) {
                    const listStudents = res.data.registers.map(async item => {
                        const resTasks = await axios.get('http://localhost:8000/api/tasks/get-tasks-by-student-lecturer', {
                            params: {
                                student: item.student._id,
                                lecturer: jwtDecode(token)._id
                            }
                        })
                        const tasks = resTasks.data.tasks
                        if (resTasks.data.status === true && tasks.length > 0) {
                            let totalCompleted = 0
                            item.student.grantt = tasks.map(task => {
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
                            item.student.totalCount = tasks.length
                            item.student.totalCompleted = totalCompleted
                        }
                        return item.student
                    })
                    Promise.all(listStudents)
                        .then(res => setStudents(res))
                        .catch(err => console.log(err))
                }
            }
            fetchStudents()
        }
    }, [slug, topic, token, fetchAgain, state.fetchAgain])

    const handlSubscribeTopic = async () => {
        if (!token) return navigate('/login')

        const resStudent = await axios.get('http://localhost:8000/api/registers/get-register-by-student/' + jwtDecode(token)._id)

        if (resStudent.data.register) {
            toast.info('You have registered: ' + resStudent.data.register.topic.title)
            toast.info("Each student is only allowed to register for one topic")
            return
        }

        const res = await axios.post('http://localhost:8000/api/registers/create-register', {
            topic: topic._id,
            student: jwtDecode(token)._id,
            lecturer: topic.lecturer._id,
        })

        if (res.data.status === true) {
            setRegister(false)
            socket.emit('send-notify', topic.lecturer.username)
            toast.success(res.data.message)
        }
    }

    return (
        <Layout breadcrumb={topic.title}>
            <h3 className='mb-4'>Thông tin đề tài</h3>
            {topic ? <>
                <div className='mb-4'>
                    <TopicInfo title={topic.title} desc={topic.description} lecturer={topic.lecturer} />
                </div>
                {students.length > 0 && <>
                    <h3 className='mb-4'>Sinh viên đăng ký</h3>
                    <div className="row">
                        {students.map(student => (
                            <div key={student._id} className='mb-4'>
                                <div className="card">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <div>
                                            <span className='me-2'>{student.fullname}</span>
                                            <span className='me-2'>{student.username.toUpperCase()}</span>
                                        </div>
                                        <Link to={`/list-tasks/${student.username}`}>
                                            <button className="btn btn-outline-primary">Chi tiết</button>
                                        </Link>
                                    </div>
                                    <div className='card-body'>
                                        {student.grantt ? (
                                            <Progress data={student.grantt} />
                                        ) : (
                                            <div className='text-center'>Sinh viên hiện chưa có công việc nào.</div>
                                        )}
                                    </div>
                                    <div className='card-footer text-end'>
                                        <b className='me-2'>Tổng số công việc hoàn thành:</b>
                                        <i>{student.totalCompleted || 0}/{student.totalCount || 0}</i>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>}
            </> : (
                <div className='mb-4'>Không tìm thấy đề tài.</div>
            )}
            {token && (jwtDecode(token).role === 1 || jwtDecode(token).status === false)
                ? <></>
                : register === null
                    ? <ButtonModalConfirm
                        id='registerModal'
                        action='Đăng ký'
                        type='primary'
                        title='Đăng ký đề tài'
                        content='Bạn có chắc chắn muốn đăng ký đề tài này?'
                        func={handlSubscribeTopic}
                    />
                    : register === false
                        ? <button className='btn btn-warning me-2 pe-none'>Chờ xác nhận</button>
                        : <button className='btn btn-success me-2 pe-none'>Đã xác nhận</button>
            }
            <button className='btn btn-secondary' onClick={() => navigate(-1)}>Trở lại</button>
        </Layout>
    )
}
