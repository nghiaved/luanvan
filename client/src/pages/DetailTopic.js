import Layout from '../components/Layout'
import axios from 'axios'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import { socket } from '../utils/socket'
import { useGlobal } from '../utils/useGlobal'

export default function DetailTopic() {
    const token = sessionStorage.getItem('token')
    const location = useLocation()
    const [topic, setTopic] = useState(location.state)
    const navigate = useNavigate()
    const { slug } = useParams()
    const [register, setRegister] = useState(null)
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
                setRegister(res.data.register?.status || null)
            }
            fetchRegister()
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
        <Layout>
            <div className='display-6 mb-4'>Thông tin đề tài</div>
            {topic ? (
                <div className='mb-4'>
                    <div className='mb-2'>
                        <b className='me-2'>Tên đề tài:</b>
                        <i>{topic.title}</i>
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
                                    <ReactQuill value={topic.description} readOnly theme="bubble" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mb-2'>
                        <b className='me-2'>Giảng viên hướng dẫn:</b>
                        <i>{topic.lecturer?.fullname}</i>
                    </div>
                </div>
            ) : (
                <div className='mb-4'>Không tìm thấy đề tài.</div>
            )}
            {token && jwtDecode(token).role === 1
                ? <></>
                : register === null
                    ? <>
                        <button className='btn btn-primary me-2' data-bs-toggle="modal" data-bs-target="#exampleModal">Đăng ký</button>
                        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Đăng ký đề tài</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        Bạn có chắc chắn muốn đăng ký đề tài này?
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Trở lại</button>
                                        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handlSubscribeTopic}>Đăng ký</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    : register === false
                        ? <button className='btn btn-warning me-2 pe-none'>Chờ xác nhận</button>
                        : <button className='btn btn-success me-2 pe-none'>Đã xác nhận</button>
            }
            <button className='btn btn-secondary' onClick={() => navigate(-1)}>Trở lại</button>
        </Layout>
    )
}
