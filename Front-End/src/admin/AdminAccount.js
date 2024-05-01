import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/layouts/AdminLayout'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import ProfileInfo from '../components/profile/ProfileInfo'
import UpdateInfo from '../components/profile/UpdateInfo'
import ChangePassword from '../components/profile/ChangePassword'
import Avatar from '../components/profile/Avatar'

export default function AdminAccount() {
    const token = sessionStorage.getItem('token')
    const [user, setUser] = useState({})

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`http://localhost:8000/api/users/get-user/${jwtDecode(token).username}`)
            setUser(res.data.user)
        }
        fetchUser()
    }, [token])

    return (
        <AdminLayout breadcrumb='Hồ sơ'>
            <div className="row">
                <div className="col-xl-4 col-lg-4 mb-4">
                    <div className="card">
                        <div className="card-body pt-4 d-flex flex-column align-items-center">
                            <Avatar src={user.avatar} alt={user.fullname} />
                            <h4>{user.fullname} <i className="bi bi-shield-check text-success"></i></h4>
                            <p>Trạng thái: <span className='text-success'>Hoạt động</span></p>
                        </div>
                    </div>
                </div>
                <div className="col-xl-8 col-lg-8">
                    <div className="card">
                        <div className="card-body pt-3">
                            <ul className="nav nav-tabs nav-tabs-bordered">
                                <li className="nav-item mt-2">
                                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#account-overview">Tổng quan</button>
                                </li>
                                <li className="nav-item mt-2">
                                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#account-edit">Cập nhật thông tin</button>
                                </li>
                                <li className="nav-item mt-2">
                                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#account-change-password">Đổi mật khẩu</button>
                                </li>
                            </ul>
                            <div className="tab-content pt-4">
                                <div className="tab-pane fade" id="account-overview">
                                    <ProfileInfo user={user} />
                                </div>
                                <div className="tab-pane fade" id="account-edit">
                                    <UpdateInfo />
                                </div>
                                <div className="tab-pane fade show active" id="account-change-password">
                                    <ChangePassword />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
