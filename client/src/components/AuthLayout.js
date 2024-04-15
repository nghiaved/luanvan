import React from 'react'
import TopBar from './TopBar'
import Footer from './Footer'

export default function AuthLayout({ name, component }) {
    return (
        <div className='layout-wrapper'>
            <TopBar />
            <header style={{ borderBottom: '4px solid #1c57a5' }}></header>
            <main>
                <div className='layout-auth-wrapper'>
                    <div className='flex-fill mt-5'>
                        <h4 className='text-center mb-3'>
                            <b>Đề tài:</b> Phát triển ứng dụng quản lý luận văn
                        </h4>
                        <p className='text-center text-secondary mb-1'>
                            Xây dựng ứng dụng web hỗ trợ quản lý tiến độ thực hiện luận văn
                        </p>
                        <ul className='text-secondary'>
                            <li>Áp dụng công nghệ MERN Stack</li>
                            <li>Quản lý tiến độ thực hiện của luận văn</li>
                        </ul>
                        <div className='d-flex justify-content-between mt-5'>
                            <div>
                                <b>Sinh viên thực hiện</b>
                                <h6>Nguyễn Thành Nghĩa B2004736</h6>
                            </div>
                            <div>
                                <b>Giảng viên hướng dẫn</b>
                                <h6>Lâm Chí Nguyện 001708</h6>
                            </div>
                        </div>
                    </div>
                    <div className='flex-fill'>
                        <h3 className='text-center mb-4'>{name}</h3>
                        {component}
                    </div>
                </div>
            </main>
            <hr className='my-2' />
            <Footer />
        </div>
    )
}
