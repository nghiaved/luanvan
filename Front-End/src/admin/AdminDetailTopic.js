import AdminLayout from '../components/layouts/AdminLayout'
import axios from 'axios'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { useGlobal } from '../utils/useGlobal'
import Progress from '../components/tasks/Progress'
import TopicInfo from '../components/topics/TopicInfo'

export default function AdminDetailTopic() {
    const token = sessionStorage.getItem('token')
    const location = useLocation()
    const [topic, setTopic] = useState(location.state)
    const navigate = useNavigate()
    const { slug } = useParams()
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

        if (token && topic) {
            const fetchStudents = async () => {
                const res = await axios.get(`http://localhost:8000/api/registers/get-registers?topic=${topic._id}&lecturer=${topic.lecturer._id}`)
                if (res.data.registers.length > 0) {
                    const listStudents = res.data.registers.map(async item => {
                        const resTasks = await axios.get('http://localhost:8000/api/tasks/get-tasks-by-student-lecturer', {
                            params: {
                                student: item.student._id,
                                lecturer: topic.lecturer._id
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

    return (
        <AdminLayout breadcrumb={topic?.title}>
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
                                            <Progress data={student.grantt} isAdmin />
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
            <div className='text-center'>
                <button className='btn btn-secondary' onClick={() => navigate(-1)}>Quay về trang trước</button>
            </div>
        </AdminLayout>
    )
}
