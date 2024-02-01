import React, { useCallback, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function ListRegisters() {
    const token = sessionStorage.getItem('token')
    const [registers, setRegisters] = useState([])
    const [action, setAction] = useState({})

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
        fetchRegisters(jwtDecode(token)._id)
    }, [fetchRegisters, token])

    const handleAcceptRegister = async (registerId) => {
        await axios.patch(`http://localhost:8000/api/registers/accept-register/${registerId}`)
            .then(res => {
                if (res.data.status === true) {
                    toast.success(res.data.message)
                    fetchRegisters(jwtDecode(token)._id)
                }
            })
            .catch(err => console.log(err))
    }

    const handleRefuseRegister = async (registerId) => {
        await axios.delete(`http://localhost:8000/api/registers/refuse-register/${registerId}`)
            .then(res => {
                if (res.data.status === true) {
                    toast.success(res.data.message)
                    fetchRegisters(jwtDecode(token)._id)
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <Layout>
            <Link to="/list-topics">Danh sách đề tài</Link>
            <div className='display-6 mt-4'>Danh sách đăng ký</div>
            {registers.length > 0 ? (
                <table className="table table-hover mt-4">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th>Họ và tên</th>
                            <th>Tài khoản</th>
                            <th>Tên đề tài</th>
                            <th>Thực hiện</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {registers.map((register, index) => (
                            <tr key={register._id}>
                                <th scope="row">{++index}</th>
                                <td>{register.student.fullname}</td>
                                <td>{register.student.username}</td>
                                <td>{register.topic.title}</td>
                                <td>
                                    {register.status === true ? (<>
                                        <Link state={register.student} to='/create-task'>Phân công</Link>
                                        <Link className='ms-2' state={register.student} to='/list-tasks'>Công việc</Link>
                                    </>
                                    ) : (<>
                                        <Link className='me-2' data-bs-toggle="modal" data-bs-target="#exampleModal"
                                            onClick={() => setAction({
                                                id: register._id,
                                                type: 'primary',
                                                text: 'Chấp nhận',
                                                desc: 'chấp nhận',
                                                func: handleAcceptRegister
                                            })}>Chấp nhận</Link>
                                        <Link data-bs-toggle="modal" data-bs-target="#exampleModal"
                                            onClick={() => setAction({
                                                id: register._id,
                                                type: 'danger',
                                                text: 'Từ chối',
                                                desc: 'từ chối',
                                                func: handleRefuseRegister
                                            })}>Từ chối</Link>
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
                                                            onClick={() => action.func(action.id)}>
                                                            {action.text}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className='mt-4'>Chưa có sinh viên nào đăng ký đề tài.</div>
            )}
        </Layout>
    )
}
