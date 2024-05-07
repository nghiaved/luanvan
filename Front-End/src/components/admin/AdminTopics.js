import React, { useCallback, useEffect, useState } from "react"
import ModalConfirm from '../modals/ModalConfirm'
import { toast } from 'react-toastify'
import { socket } from '../../utils/socket'
import axios from "axios"
import { Link } from "react-router-dom"
import Avatar from "../profile/Avatar"
import checkStatus from '../../utils/checkStatus'

export default function AdminTopics() {
    const [topics, setTopics] = useState([])
    const [topic, setTopic] = useState(null)
    const [filter, setFilter] = useState('')

    const fetchTopics = useCallback(async () => {
        await axios.get('http://localhost:8000/api/admin/get-all-topics')
            .then(res => {
                if (res.data.status === true) {
                    setTopics(res.data.topics)
                }
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        fetchTopics()
    }, [fetchTopics])

    const handleAcceptTopic = async (topic) => {
        await axios.patch(`http://localhost:8000/api/admin/accept-topic/${topic._id}`)
            .then(res => {
                if (res.data.status === true) {
                    socket.emit('send-notify', topic.lecturer.username)
                    toast.success(res.data.message)
                    fetchTopics()
                }
            })
            .catch(err => console.log(err))
    }

    const handleRefuseTopic = async () => {
        await axios.delete(`http://localhost:8000/api/admin/refuse-topic/${topic._id}`)
            .then(res => {
                if (res.data.status === true) {
                    socket.emit('send-notify', topic.lecturer.username)
                    toast.success(res.data.message)
                    fetchTopics()
                }
            })
            .catch(err => console.log(err))
    }

    const handleClockTopic = async () => {
        await axios.patch(`http://localhost:8000/api/admin/clock-topic/${topic._id}`)
            .then(res => {
                if (res.data.status === true) {
                    toast.success(res.data.message)
                    fetchTopics()
                }
            })
            .catch(err => console.log(err))
    }

    const handleUnclockTopic = async (id) => {
        await axios.patch(`http://localhost:8000/api/admin/unclock-topic/${id}`)
            .then(res => {
                if (res.data.status === true) {
                    toast.success(res.data.message)
                    fetchTopics()
                }
            })
            .catch(err => console.log(err))
    }

    const handleFilter = item => {
        if (filter === '1') return item.status === true
        if (filter === '2') return item.status === false
        return filter.toLowerCase() === '' ? item
            : item.title.toLowerCase().includes(filter.toLowerCase())
            || item.lecturer.username.toLowerCase().includes(filter.toLowerCase())
            || item.lecturer.fullname.toLowerCase().includes(filter.toLowerCase())
    }

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h3>Quản lý đề tài</h3>
                <div className="flex-fill d-flex justify-content-end gap-4">
                    <select onChange={(e) => setFilter(e.target.value)} className="form-select home-filter">
                        <option defaultChecked value=''>Tất cả</option>
                        <option value='1'>Đã xác nhận</option>
                        <option value='2'>Chờ phản hồi</option>
                    </select>
                    <input onChange={e => setFilter(e.target.value)} className="form-control home-filter" placeholder="Tìm kiếm..." />
                </div>
            </div>
            {topics.length > 0 ? <>
                <div className="row mt-4">
                    {topics.filter(item => handleFilter(item)).map(topic => (
                        <div key={topic._id} className='col-lg-6 mb-4'>
                            <div className={`card h-100 ${checkStatus(topic.limit, topic.registered, 'text-primary')}`}>
                                <div className="card-header">
                                    <h6 className="text-nowrap overflow-hidden mb-0">{topic.title}</h6>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between mb-4">
                                        <div>
                                            <h6>{topic.lecturer.fullname}</h6>
                                            <span>{topic.lecturer.username}</span>
                                        </div>
                                        <Link to={`/profile/${topic.lecturer.username}`}>
                                            <Avatar src={topic.lecturer.avatar} alt={topic.lecturer.fullname} />
                                        </Link>
                                    </div>
                                    <div className='d-flex justify-content-between'>
                                        <Link to={`/detail-topic/${topic.slug}`} className='text-info'>Chi tiết</Link>
                                        <div>
                                            {topic.status === true
                                                ? topic.isActive ? <>
                                                    <span className="text-success">Hoạt động</span>
                                                    <button className='btn btn-sm btn-danger ms-2'
                                                        data-bs-toggle="modal" data-bs-target="#clockModal"
                                                        onClick={() => setTopic(topic)}>
                                                        Khoá
                                                    </button>
                                                </> : <>
                                                    <span className="text-danger">Đang khoá</span>
                                                    <button className='btn btn-sm btn-success ms-2'
                                                        onClick={() => handleUnclockTopic(topic._id)}>
                                                        Mở lại
                                                    </button>
                                                </>
                                                : <>
                                                    <button className='btn btn-sm btn-primary me-2'
                                                        onClick={() => handleAcceptTopic(topic)}>
                                                        Xác nhận
                                                    </button>
                                                    <button className='btn btn-sm btn-danger'
                                                        data-bs-toggle="modal" data-bs-target="#refuseModal"
                                                        onClick={() => setTopic(topic)}>
                                                        Từ chối
                                                    </button>
                                                </>}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer">
                                    Số lượng đăng ký: {topic.registered}/{topic.limit}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <ModalConfirm
                    id='refuseModal'
                    action='Xoá'
                    type='danger'
                    title='Xoá đề tài'
                    content='Bạn có chắc chắn muốn xoá đề tài này?'
                    func={handleRefuseTopic}
                />
                <ModalConfirm
                    id='clockModal'
                    action='Khoá'
                    type='danger'
                    title='Khoá đề tài'
                    content='Bạn có chắc chắn muốn khoá đề tài này?'
                    func={handleClockTopic}
                />
            </> : (
                <div className="mt-4">Chưa có đề tài.</div>
            )}
        </>
    )
}
