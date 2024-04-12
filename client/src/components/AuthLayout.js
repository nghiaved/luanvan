import React from 'react'
import { Link } from 'react-router-dom'
import TopBar from './TopBar'
import Footer from './Footer'

export default function AuthLayout({ children, action }) {
    return (
        <div className='layout-wrapper'>
            <TopBar />
            <header>
                <Link to='/'>Trang chủ</Link>
                <Link to={action.path}>{action.name}</Link>
            </header>
            <main>{children}</main>
            <hr className='my-2' />
            <Footer />
        </div>
    )
}
