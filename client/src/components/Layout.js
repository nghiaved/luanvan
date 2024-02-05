import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobal } from '../utils/useGlobal'

export default function Layout({ children }) {
    const token = sessionStorage.getItem('token')
    const navigate = useNavigate()
    const [messages, setMessages] = useState([])
    const [state] = useGlobal()
    const [fetchAgain, setFetchAgain] = useState(false)

    const handleLogout = () => {
        sessionStorage.removeItem('token')
        navigate(0)
    }

    useEffect(() => {
        if (state.fetchAgain !== fetchAgain) {
            setFetchAgain(state.fetchAgain)
        }

        if (token) {
            const fetchMessages = async () => {
                const res = await axios.get('http://localhost:8000/api/messages/get-messages/' + jwtDecode(token)._id)
                setMessages(res.data.messages)
            }
            fetchMessages()
        }
    }, [token, fetchAgain, state.fetchAgain])


    return (
        <div className="layout-wrapper">
            <header>
                <Link to='/'>Trang chủ</Link>
                {token ? (
                    <div className='d-flex align-items-center'>
                        <div className="btn-group me-2">
                            <button type="button" className="btn text-white border-0" data-bs-toggle="dropdown" aria-expanded="false">
                                <span>({messages.length})</span>
                                <i className="bi bi-bell-fill"></i>
                            </button>
                            <ul onClick={e => e.stopPropagation()} className="dropdown-menu dropdown-menu-end">
                                {messages.map(item => (
                                    <li key={item._id} className="dropdown-item d-flex justify-content-between">
                                        <span>{`${item.sender.fullname} ${item.content} ${item.topic.title}`}</span>
                                        <i className="bi bi-x text-danger"></i>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="btn-group me-2">
                            <button type="button" className="btn text-white border-0 dropdown-toggle"
                                data-bs-toggle="dropdown" aria-expanded="false">
                                {jwtDecode(token).fullname}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li>
                                    <button className="dropdown-item" type="button">
                                        Trang cá nhân
                                    </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    {jwtDecode(token).role === 1
                                        ? <Link to='/list-topics'>
                                            <button className="dropdown-item" type="button">
                                                Quản lý
                                            </button>
                                        </Link>
                                        : <Link to='/student'>
                                            <button className="dropdown-item" type="button">
                                                Đề tài
                                            </button>
                                        </Link>}
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    <button onClick={handleLogout} className="dropdown-item" type="button">
                                        Đăng xuất
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <Link to='/login'>Đăng nhập</Link>
                )}
            </header>
            <main>{children}</main>
        </div>
    )
}
