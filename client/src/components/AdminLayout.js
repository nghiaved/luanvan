import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopBar from './TopBar'
import Footer from './Footer'

export default function AdminLayout({ children }) {
    const navigate = useNavigate()

    const handleLogout = () => {
        sessionStorage.removeItem('token')
        navigate(0)
    }

    return (
        <div className='layout-wrapper'>
            <TopBar />
            <header>
                <Link to='/'>Trang quản lý</Link>
                <Link onClick={handleLogout}>Đăng xuất</Link>
            </header>
            <main>{children}</main>
            <hr className='my-2' />
            <Footer />
        </div>
    )
}
