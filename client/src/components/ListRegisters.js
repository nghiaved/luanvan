import { Link } from 'react-router-dom'
import React, { useCallback, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { toast } from 'react-toastify'
import { useGlobal } from '../utils/useGlobal'
import { socket } from '../utils/socket'
import axios from "axios"

export default function ListRegisters() {
    const token = sessionStorage.getItem('token')
    const [fetchAgain, setFetchAgain] = useState(false)
    const [registers, setRegisters] = useState([])
    const [action, setAction] = useState({})
    const [state] = useGlobal()

    const fetchRegisters = useCallback(async (userId) => {
        await axios.get('http://localhost:8000/api/registers/get-registers-by-lecturer/' + userId)
            .then(res => {
                if (res.data.status === true) {
                    setRegisters(res.data.registers)
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
                                            {register.status === true
                                                ? <span className="text-success">Đã xác nhận</span>
                                                : <span className="text-danger">Chờ xác nhận</span>}
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
                                        <img className='img-avatar mb-2' src={register.student.avatar ? register.student.avatar : "/no-avatar.png"} alt={register.student.fullname} />
                                    </div>
                                    <p className='text-end'>
                                        {register.status === true ? (
                                            <Link className='ms-2' state={register.student} to='/list-tasks'>Công việc</Link>
                                        ) : (<>
                                            <Link className='me-2' data-bs-toggle="modal" data-bs-target="#exampleModal"
                                                onClick={() => setAction({
                                                    id: register._id,
                                                    username: register.student.username,
                                                    type: 'primary',
                                                    text: 'Chấp nhận',
                                                    desc: 'chấp nhận',
                                                    func: handleAcceptRegister
                                                })}>Chấp nhận</Link>
                                            <Link data-bs-toggle="modal" data-bs-target="#exampleModal"
                                                onClick={() => setAction({
                                                    id: register._id,
                                                    username: register.student.username,
                                                    type: 'danger',
                                                    text: 'Từ chối',
                                                    desc: 'từ chối',
                                                    func: handleRefuseRegister
                                                })}>Từ chối</Link>
                                        </>)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">{action.text} đăng ký</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Bạn có chắc chắn muốn {action.desc} đăng ký này?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Trở lại</button>
                                <button type="button" className={`btn btn-${action.type}`} data-bs-dismiss="modal"
                                    onClick={() => action.func(action.id, action.username)}>
                                    {action.text}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </>) : (
                <div className='mt-4'>Chưa có sinh viên nào đăng ký đề tài.</div>
            )}
        </>
    )
}
