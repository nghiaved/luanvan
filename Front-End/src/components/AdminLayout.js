import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import TopBar from './TopBar'
import Breadcrumb from './Breadcrumb'
import Footer from './Footer'
import BackToTop from './BackToTop'

export default function AdminLayout({ children, breadcrumb }) {
    const navigate = useNavigate()

    const handleLogout = () => {
        sessionStorage.removeItem('token')
        navigate(0)
    }

    return (
        <div className='layout-wrapper'>
            <TopBar />
            <header>
                <Link to='/account'>
                    <i className="bi bi-person"></i> Quản trị viên
                </Link>
                <Link onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i>
                </Link>
            </header>
            <Breadcrumb name={breadcrumb} />
            <main>{children}</main>
            <hr className='my-2' />
            <Footer />
            <BackToTop />
        </div>
    )
}
