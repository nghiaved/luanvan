import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { Doughnut } from 'react-chartjs-2'
import axios from "axios"

export default function Dashboard() {
    const [home, setHome] = useState({})

    useEffect(() => {
        const fetchHome = async () => {
            await axios.get('http://localhost:8000/api/admin/get-home')
                .then(res => {
                    if (res.data.status === true) {
                        setHome({
                            students: [
                                res.data.students.length,
                                res.data.students.reduce((total, item) => item.status === true ? total + 1 : total, 0)
                            ],
                            lecturers: [
                                res.data.lecturers.length,
                                res.data.lecturers.reduce((total, item) => item.status === true ? total + 1 : total, 0)
                            ],
                            topics: [
                                res.data.topics.length,
                                res.data.topics.reduce((total, item) => item.status === true ? total + 1 : total, 0)
                            ],
                            registers: [
                                res.data.registers.length,
                                res.data.registers.reduce((total, item) => item.final === true ? total + 1 : total, 0)
                            ]
                        })
                    }
                })
                .catch(err => console.log(err))
        }
        fetchHome()
    }, [])

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
                                {home.students && (
                                    <div style={{ width: 130, height: 130 }}>
                                        <Doughnut data={{
                                            labels: ["Đã xác nhận", "Chờ phản hồi",],
                                            datasets: [{
                                                backgroundColor: ["#3e95cd", "#1c57a5"],
                                                data: [home.students[1], home.students[0] - home.students[1]]
                                            }]
                                        }} />
                                        <p style={{ fontSize: 14 }} className="mt-3 text-end">Số lượng: {home.students[0]}</p>
                                    </div>
                                )}
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
                                {home.lecturers && (
                                    <div style={{ width: 130, height: 130 }}>
                                        <Doughnut data={{
                                            labels: ["Đã xác nhận", "Chờ phản hồi",],
                                            datasets: [{
                                                backgroundColor: ["#3e95cd", "#1c57a5"],
                                                data: [home.lecturers[1], home.lecturers[0] - home.lecturers[1]]
                                            }]
                                        }} />
                                        <p style={{ fontSize: 14 }} className="mt-3 text-end">Số lượng: {home.lecturers[0]}</p>
                                    </div>
                                )}
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
                                {home.topics && (
                                    <div style={{ width: 130, height: 130 }}>
                                        <Doughnut data={{
                                            labels: ["Đã xác nhận", "Chờ phản hồi",],
                                            datasets: [{
                                                backgroundColor: ["#3e95cd", "#1c57a5"],
                                                data: [home.topics[1], home.topics[0] - home.topics[1]]
                                            }]
                                        }} />
                                        <p style={{ fontSize: 14 }} className="mt-3 text-end">Số lượng: {home.topics[0]}</p>
                                    </div>
                                )}
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
                                {home.registers && (
                                    <div style={{ width: 130, height: 130 }}>
                                        <Doughnut data={{
                                            labels: ["Đã hoàn thành", "Đang thực hiện",],
                                            datasets: [{
                                                backgroundColor: ["#3e95cd", "#1c57a5"],
                                                data: [home.registers[1], home.registers[0] - home.registers[1]]
                                            }]
                                        }} />
                                        <p style={{ fontSize: 14 }} className="mt-3 text-end">Số lượng: {home.registers[0]}</p>
                                    </div>
                                )}
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
