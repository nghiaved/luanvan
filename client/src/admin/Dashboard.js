import React from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { Doughnut } from 'react-chartjs-2'

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
                            <div className="d-flex justify-content-between">
                                <div>
                                    <Link to="/students">
                                        <h5 className="card-title">Quản lý sinh viên</h5>
                                    </Link>
                                    <p className="card-text">Thông tin liên quan đến sinh viên bao gồm: họ tên, chuyên ngành, khoá,...</p>
                                </div>
                                <div style={{ width: 120, height: 120 }}>
                                    <Doughnut data={{
                                        labels: ["Đã đăng ký", "Còn trống",],
                                        datasets: [{ backgroundColor: ["#3e95cd", "#1c57a5"], data: [2, 1] }]
                                    }} />
                                </div>
                            </div>
                            <Link to="/students">
                                <button className="btn btn-outline-primary">Xem thêm</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='col-6'>
                    <div className="card">
                        <div className="card-header">
                            Giảng viên
                        </div>
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <Link to="/lecturers">
                                        <h5 className="card-title">Quản lý giảng viên</h5>
                                    </Link>
                                    <p className="card-text">Thông tin liên quan đến giảng viên bao gồm: họ tên, chức vụ,...</p>
                                </div>
                                <div style={{ width: 120, height: 120 }}>
                                    <Doughnut data={{
                                        labels: ["Đã đăng ký", "Còn trống",],
                                        datasets: [{ backgroundColor: ["#3e95cd", "#1c57a5"], data: [2, 1] }]
                                    }} />
                                </div>
                            </div>
                            <Link to="/lecturers">
                                <button className="btn btn-outline-primary">Xem thêm</button>
                            </Link>
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
                            <div className="d-flex justify-content-between">
                                <div>
                                    <Link to="/topics">
                                        <h5 className="card-title">Quản lý đề tài</h5>
                                    </Link>
                                    <p className="card-text">Thông tin liên quan đến đề tài bao gồm: tên đề tài, giảng viên hướng dẫn,...</p>
                                </div>
                                <div style={{ width: 120, height: 120 }}>
                                    <Doughnut data={{
                                        labels: ["Đã đăng ký", "Còn trống",],
                                        datasets: [{ backgroundColor: ["#3e95cd", "#1c57a5"], data: [2, 1] }]
                                    }} />
                                </div>
                            </div>
                            <Link to="/topics">
                                <button className="btn btn-outline-primary">Xem thêm</button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='col-6'>
                    <div className="card">
                        <div className="card-header">
                            Đồ án
                        </div>
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div>
                                    <Link to="/projects">
                                        <h5 className="card-title">Quản lý đồ án</h5>
                                    </Link>
                                    <p className="card-text">Thông tin liên quan đến đồ án bao gồm: tên đề tài, sinh viên thực hiện, giảng viên hướng dẫn,...</p>
                                </div>
                                <div style={{ width: 120, height: 120 }}>
                                    <Doughnut data={{
                                        labels: ["Đã đăng ký", "Còn trống",],
                                        datasets: [{ backgroundColor: ["#3e95cd", "#1c57a5"], data: [2, 1] }]
                                    }} />
                                </div>
                            </div>
                            <Link to="/projects">
                                <button className="btn btn-outline-primary">Xem thêm</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
