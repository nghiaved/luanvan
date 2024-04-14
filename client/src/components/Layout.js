import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGlobal } from '../utils/useGlobal'
import { toast } from 'react-toastify'
import TopBar from './TopBar'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'
import BackToTop from './BackToTop'

export default function Layout({ children, breadcrumb }) {
    const token = sessionStorage.getItem('token')
    const navigate = useNavigate()
    const [messages, setMessages] = useState([])
    const [newMessages, setNewMessages] = useState(0)
    const [state] = useGlobal()
    const [fetchAgain, setFetchAgain] = useState(false)

    const handleLogout = () => {
        sessionStorage.removeItem('token')
        navigate(0)
    }

    const fetchMessages = useCallback(async () => {
        const res = await axios.get('http://localhost:8000/api/messages/get-messages/' + jwtDecode(token)._id)
        setMessages(res.data.messages)
        const newMessages = res.data.messages.filter(item => item.status === false).length
        setNewMessages(newMessages)
    }, [token])

    useEffect(() => {
        if (state.fetchAgain !== fetchAgain) {
            setFetchAgain(state.fetchAgain)
        }

        if (token) {
            fetchMessages()
        }
    }, [token, fetchMessages, fetchAgain, state.fetchAgain])

    const handleReadMessage = async (id) => {
        const res = await axios.patch('http://localhost:8000/api/messages/read-message/' + id)
        if (res.data.status === true) {
            fetchMessages()
        }
    }

    const handleReadAllMessages = async () => {
        const res = await axios.patch('http://localhost:8000/api/messages/read-all-messages/' + jwtDecode(token)._id)
        if (res.data.status === true) {
            fetchMessages()
        }
    }

    const handleDeleteMessage = async (id) => {
        const res = await axios.delete('http://localhost:8000/api/messages/delete-message/' + id)
        if (res.data.status === true) {
            toast.success(res.data.message)
            fetchMessages()
        }
    }

    const handleDeleteAllMessages = async (id) => {
        const res = await axios.delete('http://localhost:8000/api/messages/delete-all-messages/' + jwtDecode(token)._id)
        if (res.data.status === true) {
            toast.success(res.data.message)
            fetchMessages()
        }
    }

    return (
        <div className="layout-wrapper">
            <TopBar />
            <header>
                <Link to='/'>
                    <i className="bi bi-house-door-fill"></i>
                </Link>
                {token ? (
                    <div className='d-flex align-items-center'>
                        <div className="btn-group me-2">
                            <button type="button" className="btn text-white border-0" data-bs-toggle="dropdown" aria-expanded="false">
                                {newMessages > 0 && `(${newMessages})`}
                                <i className="bi bi-bell-fill"></i>
                            </button>
                            <ul className={`dropdown-menu dropdown-menu-end ${messages.length === 0 && 'd-none'}`}>
                                <li className="dropdown-item d-flex justify-content-between">
                                    <button onClick={handleReadAllMessages} className="dropdown-item p-0" type="button">
                                        Đọc tất cả
                                    </button>
                                    <button onClick={handleDeleteAllMessages} className="dropdown-item p-0 text-end" type="button">
                                        Xoá tất cả
                                    </button>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                {messages.map(item => (
                                    <li key={item._id} className="dropdown-item d-flex justify-content-between">
                                        <Link
                                            onClick={() => handleReadMessage(item._id)}
                                            className={item.status === true ? 'text-secondary' : 'text-primary'}
                                            to={jwtDecode(token).role === 1 ? '/lecturer' : '/student'}>
                                            {item.sender.fullname + ' ' + item.content}
                                        </Link>
                                        <i onClick={e => {
                                            e.stopPropagation()
                                            handleDeleteMessage(item._id)
                                        }} className="bi bi-x text-danger btn p-0 ms-2"></i>
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
                                    <Link to='/account'>
                                        <button className="dropdown-item" type="button">
                                            Trang cá nhân
                                        </button>
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                <li>
                                    {jwtDecode(token).role === 1
                                        ? <Link to='/lecturer'>
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
            <Breadcrumb name={breadcrumb} />
            <main>{children}</main>
            <hr className='my-2' />
            <Footer />
            <BackToTop />
        </div>
    )
}
