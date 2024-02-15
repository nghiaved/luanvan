import React from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

export default function Dashboard() {
    return (
        <AdminLayout>
            <div className='display-6'>Trang quản lý hệ thống</div>
            <div className='row mt-4'>
                <div className='col-6'>
                    <div className="card">
                        <div className="card-header">
                            Sinh viên
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Quản lý sinh viên</h5>
                            <p className="card-text">Thông tin liên quan đến sinh viên bao gồm: họ tên, chuyên ngành, khoá,...</p>
                            <p className='text-end'>
                                <Link to="/students">Xem thêm</Link>
                            </p>
                        </div>
                    </div>
                </div>
                <div className='col-6'>
                    <div className="card">
                        <div className="card-header">
                            Giảng viên
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Quản lý giảng viên</h5>
                            <p className="card-text">Thông tin liên quan đến giảng viên bao gồm: họ tên, chức vụ,...</p>
                            <p className='text-end'>
                                <Link to="/lecturers">Xem thêm</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row mt-4'>
                <div className='col-6'>
                    <div className="card">
                        <div className="card-header">
                            Đề tài
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Quản lý đề tài</h5>
                            <p className="card-text">Thông tin liên quan đến đề tài bao gồm: tên đề tài, giảng viên hướng dẫn,...</p>
                            <p className='text-end'>
                                <Link to="/topics">Xem thêm</Link>
                            </p>
                        </div>
                    </div>
                </div>
                <div className='col-6'>
                    <div className="card">
                        <div className="card-header">
                            Đồ án
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">Quản lý đồ án</h5>
                            <p className="card-text">Thông tin liên quan đến đồ án bao gồm: tên đề tài, sinh viên thực hiện, giảng viên hướng dẫn,...</p>
                            <p className='text-end'>
                                <Link to="/projects">Xem thêm</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
