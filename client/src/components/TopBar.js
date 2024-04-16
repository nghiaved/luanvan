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
                    <h5 className='mb-0 text-primary'>Trường Công nghệ thông tin và Truyền thông</h5>
                </div>
            </div>
            <div className='d-flex align-items-center'>
                <div className='ms-2'>
                    <b>ỨNG DỤNG</b>
                    <h5 className='mb-0 text-primary'>Quản lý luận văn</h5>
                </div>
                <img style={{ height: 60 }} src='/logo.png' alt='Logo CTU' />
            </div>
        </div>
    )
}
