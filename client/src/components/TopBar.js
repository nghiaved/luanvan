import React from 'react'
import { Link } from 'react-router-dom'

export default function TopBar() {
    return (
        <div className='d-flex align-items-center justify-content-between mx-4'>
            <div className='d-flex align-items-center'>
                <Link to='/'>
                    <img style={{ height: 80 }} src='/logo-cict.png' alt='Logo CICT' />
                </Link>
                <div className='ms-2'>
                    <b>TRƯỜNG ĐẠI HỌC CẦN THƠ</b>
                    <h5 className='mb-0 text-primary'>Ứng dụng quản lý luận văn - CICT</h5>
                </div>
            </div>
            <Link to='/'>
                <img style={{ height: 60 }} src='/logo-ctu.png' alt='Logo CTU' />
            </Link>
        </div>
    )
}
