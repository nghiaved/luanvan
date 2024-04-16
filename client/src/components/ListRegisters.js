import { Link } from 'react-router-dom'
import React, { useCallback, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { toast } from 'react-toastify'
import { useGlobal } from '../utils/useGlobal'
import { socket } from '../utils/socket'
import Avatar from '../components/Avatar'
import Status from '../components/Status'
import ModalConfirm from '../components/ModalConfirm'
import axios from "axios"

export default function ListRegisters() {
    const token = sessionStorage.getItem('token')
    const [fetchAgain, setFetchAgain] = useState(false)
    const [registers, setRegisters] = useState([])
    const [action, setAction] = useState({})
    const [state, dispatch] = useGlobal()

    const fetchRegisters = useCallback(async (userId) => {
        await axios.get('http://localhost:8000/api/registers/get-registers-by-lecturer/' + userId)
            .then(res => {
                if (res.data.status === true && res.data.registers.length > 0) {
                    const listStudents = res.data.registers.map(async register => {
                        const resp = await axios.get(`http://localhost:8000/api/messes/get-messes/${register._id}`)
                        const newMesses = resp.data.messes.filter(item => item.reader === userId && item.status === false)
                        register.newMesses = newMesses.length
                        return register
                    })
                    Promise.all(listStudents)
                        .then(res => setRegisters(res))
                        .catch(err => console.log(err))
                }
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if (state.fetchAgain !== fetchAgain) {
            setFetchAgain(state.fetchAgain)
        }

        fetchRegisters(jwtDecode(token)._id)
    }, [fetchRegisters, token, fetchAgain, state.fetchAgain])

    const handleAcceptRegister = async (registerId, username) => {
        await axios.patch(`http://localhost:8000/api/registers/accept-register/${registerId}`)
            .then(res => {
                if (res.data.status === true) {
                    socket.emit('send-notify', username)
                    toast.success(res.data.message)
                    fetchRegisters(jwtDecode(token)._id)
                }
            })
            .catch(err => console.log(err))
    }

    const handleRefuseRegister = async (registerId, username) => {
        await axios.delete(`http://localhost:8000/api/registers/refuse-register/${registerId}`)
            .then(res => {
                if (res.data.status === true) {
                    socket.emit('send-notify', username)
                    toast.success(res.data.message)
                    fetchRegisters(jwtDecode(token)._id)
                }
            })
            .catch(err => console.log(err))
    }

    const handleClickMessage = async (register) => {
        await axios.patch(`http://localhost:8000/api/messes/read-messes`, {
            register: register._id,
            reader: register.lecturer
        })
        fetchRegisters(register.lecturer)
        dispatch({
            userConversation: state.userConversation ? null : register.student,
            registerId: register._id
        })
    }

    return (
        <>
            <h3>Danh sách đăng ký</h3>
            {registers.length > 0 ? (<>
                <div className="row mt-4">
                    {registers.map(register => (
                        <div key={register._id} className='col-lg-6 mb-4'>
                            <div className="card h-100">
                                <div className="card-header">
                                    <div className="d-flex justify-content-between">
                                        <Link className='text-nowrap overflow-hidden' state={register.topic} to={`/detail-topic/${register.topic.slug}`}>
                                            <b>{register.topic.title}</b>
                                        </Link>
                                        <div className="card-text text-nowrap ms-2">
                                            <Status check={register.status} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className='d-flex justify-content-between mb-3'>
                                        <div>
                                            <p className="card-text mb-0">
                                                Họ tên: {register.student.fullname}
                                            </p>
                                            <p className="card-text">
                                                MSSV: {register.student.username.toUpperCase()}
                                            </p>
                                        </div>
                                        <Link to={`/profile/${register.student.username}`}>
                                            <Avatar src={register.student.avatar} alt={register.student.fullname} />
                                        </Link>
                                    </div>
                                    <div className='d-flex justify-content-between'>
                                        <button onClick={() => handleClickMessage(register)} className='btn btn-sm btn-outline-success'>
                                            {register.student.isOnline && <i className="bi bi-circle-fill"></i>}
                                            <span className='mx-2'>Liên hệ</span>
                                            <i className="bi bi-chat-dots"></i>
                                            {register.newMesses > 0 && <span className='ms-2 text-danger'>({register.newMesses})</span>}
                                        </button>
                                        <div>
                                            {register.status === true ? (
                                                <Link className='ms-2' state={register.student} to='/list-tasks'>Công việc</Link>
                                            ) : (<>
                                                <Link className='me-2' data-bs-toggle="modal" data-bs-target="#confirmModal"
                                                    onClick={() => setAction({
                                                        id: register._id,
                                                        username: register.student.username,
                                                        type: 'primary',
                                                        text: 'Chấp nhận',
                                                        desc: 'chấp nhận',
                                                        func: handleAcceptRegister
                                                    })}>Chấp nhận</Link>
                                                <Link data-bs-toggle="modal" data-bs-target="#confirmModal"
                                                    onClick={() => setAction({
                                                        id: register._id,
                                                        username: register.student.username,
                                                        type: 'danger',
                                                        text: 'Từ chối',
                                                        desc: 'từ chối',
                                                        func: handleRefuseRegister
                                                    })}>Từ chối</Link>
                                            </>)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <ModalConfirm
                    id='confirmModal'
                    action={action.text}
                    type={action.type}
                    title={`${action.text} đăng ký`}
                    content={`Bạn có chắc chắn muốn ${action.desc} đăng ký này?`}
                    func={() => action.func(action.id, action.username)}
                />
            </>) : (
                <div className='mt-4'>Chưa có sinh viên nào đăng ký đề tài.</div>
            )}
        </>
    )
}
