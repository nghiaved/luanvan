import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../components/layouts/AdminLayout'
import { Doughnut, Bar } from 'react-chartjs-2'
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
            <h3 className='text-center'>Ứng dụng tiến độ đề tài!</h3>
            <div className='row mt-4'>
                <div className='col-6'>
                    <div className="card">
                        <div className="card-header">
                            Tổng quan
                        </div>
                        <div style={{ height: 198 }} className="card-body d-flex justify-content-center">
                            {home.topics && home.lecturers && home.students && (
                                <Bar data={{
                                    labels: ["Giảng viên", "Sinh viên", "Đề tài"],
                                    datasets: [
                                        {
                                            label: "Tổng số",
                                            data: [
                                                home.lecturers[0],
                                                home.students[0],
                                                home.topics[0]
                                            ],
                                            backgroundColor: "#1c57a5",
                                        },
                                        {
                                            label: "Chờ phản hồi",
                                            data: [
                                                home.lecturers[0] - home.lecturers[1],
                                                home.students[0] - home.students[1],
                                                home.topics[0] - home.topics[1]
                                            ],
                                            backgroundColor: "#3e95cd",
                                        },
                                    ],
                                }} />
                            )}
                        </div>
                    </div>
                </div>
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
                                                backgroundColor: ["#1c57a5", "#3e95cd"],
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
            </div>
            <div className='row mt-4'>
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
                                                backgroundColor: ["#1c57a5", "#3e95cd"],
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
                                                backgroundColor: ["#1c57a5", "#3e95cd"],
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
            </div>
        </AdminLayout>
    )
}
