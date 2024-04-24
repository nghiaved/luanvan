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
                    <div className='flex-fill'>
                        <h4 className='mb-3'>
                            <b>Đề tài:</b> Phát triển ứng dụng quản lý tiến độ đề tài
                        </h4>
                        <p className='text-secondary mb-1'>
                            Xây dựng một ứng dụng web cho phép người dùng theo dõi, kiểm soát và cập nhật tiến độ của các đề tài bằng công nghệ MERN Stack.
                        </p>
                        <b>Các chức năng chính:</b>
                        <ul className='text-secondary'>
                            <li>Quản lý đề tài và công việc</li>
                            <li>Theo dõi tiến độ và đánh giá</li>
                            <li>Thông báo và nhắc nhở</li>
                            <li>Báo cáo và thống kê</li>
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
