import { jwtDecode } from 'jwt-decode'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Layout({ children }) {
    const navigate = useNavigate()

    const renderActionHeader = () => {
        const token = sessionStorage.getItem('token')
        return token ?
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
            </div> : (
                <Link to='/login'>Đăng nhập</Link>
            )
    }

    const handleLogout = async () => {
        sessionStorage.removeItem('token')
        navigate(0)
    }

    return (
        <div className="layout-wrapper">
            <header>
                <Link to='/'>Trang chủ</Link>
                {renderActionHeader()}
            </header>
            <main>{children}</main>
        </div>
    )
}
