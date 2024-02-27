import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'
import axios from 'axios'

export default function Account() {
    const token = sessionStorage.getItem('token')
    const [user, setUser] = useState({})

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`http://localhost:8000/api/users/get-user/${jwtDecode(token).username}`)
            setUser(res.data.user)
        }
        fetchUser()
    }, [token])

    const handleUpdateInfo = async (e) => {
        e.preventDefault()

        const { birth, sex, grade, major, course, faculty, email, phone } = e.target

        await axios.put(`http://localhost:8000/api/users/update-info/${jwtDecode(token)._id}`, {
            birth: birth?.value,
            sex: sex?.value,
            grade: grade?.value,
            major: major?.value,
            course: course?.value,
            faculty: faculty?.value,
            email: email?.value,
            phone: phone?.value
        })
            .then(res => {
                if (res.data.status === true) {
                    toast.success(res.data.message)
                }
            })
            .catch(err => console.log(err))
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()

        const { currentPassword, newPassword, renewPassword } = e.target

        if (newPassword.value !== renewPassword.value) {
            return toast.error('Re-enter incorrect password')
        }

        await axios.patch(`http://localhost:8000/api/users/change-password/${jwtDecode(token)._id}`, {
            password: currentPassword.value,
            newPassword: newPassword.value
        })
            .then(res => {
                if (res.data.status === true) {
                    toast.success(res.data.message)
                } else {
                    toast.error(res.data.message)
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <Layout>
            <div className="row">
                <div className="col-xl-4 col-lg-4 mb-4">
                    <div className="card">
                        <div className="card-body pt-4 d-flex flex-column align-items-center">
                            <h4>{user.fullname}</h4>
                            <h6>{user.username}</h6>
                            <p>
                                Trạng thái: {user.status
                                    ? <span className='text-success'>Đã xác nhận</span>
                                    : <span className='text-warning'>Chờ xác nhận</span>
                                }
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-xl-8 col-lg-8">
                    <div className="card">
                        <div className="card-body pt-3">
                            <div className="d-flex justify-content-end">
                                <Link to={`/profile/${user.username}`} className="btn btn-outline-info">Xem thông tin</Link>
                            </div>
                            <ul className="nav nav-tabs nav-tabs-bordered">
                                <li className="nav-item">
                                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#account-overview">Tổng quan</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#account-edit">Cập nhật thông tin</button>
                                </li>
                                <li className="nav-item">
                                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#account-change-password">Đổi mật khẩu</button>
                                </li>
                            </ul>
                            <div className="tab-content pt-4">
                                <div className="tab-pane fade show active" id="account-overview">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th colSpan={2} scope="col">
                                                    <h3 className='text-center'>
                                                        Thông tin cá nhân
                                                    </h3>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-group-divider">
                                            <tr>
                                                <th scope="row">Mã số {user.role === 1 ? 'CB' : 'SV'}</th>
                                                <td>{user.username}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Họ tên</th>
                                                <td>{user.fullname}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Ngày sinh</th>
                                                <td>{user.birth}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Giới tính</th>
                                                <td>{user.sex}</td>
                                            </tr>
                                            {user.role !== 1 && <>
                                                <tr>
                                                    <th scope="row">Lớp</th>
                                                    <td>{user.grade}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Ngành học</th>
                                                    <td>{user.major}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Khoá học</th>
                                                    <td>{user.course}</td>
                                                </tr>
                                            </>}
                                            <tr>
                                                <th scope="row">Khoa</th>
                                                <td>{user.faculty}</td>
                                            </tr>
                                            {user.role === 1 && <>
                                                <tr>
                                                    <th scope="row">Email</th>
                                                    <td>{user.email}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Số điện thoại</th>
                                                    <td>{user.phone}</td>
                                                </tr>
                                            </>}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="tab-pane fade" id="account-edit">
                                    <form onSubmit={handleUpdateInfo}>
                                        <div className="row mb-3">
                                            <label htmlFor="birth" className="col-3 col-form-label">Ngày sinh</label>
                                            <div className="col-8">
                                                <input name='birth' required maxLength={30} autoComplete='off'
                                                    type="text" className="form-control" id="birth" defaultValue={user.birth} />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label htmlFor="sex" className="col-3 col-form-label">Giới tính</label>
                                            <div className="col-8">
                                                <input name='sex' required maxLength={30} autoComplete='off'
                                                    type="text" className="form-control" id="sex" defaultValue={user.sex} />
                                            </div>
                                        </div>
                                        {user.role !== 1 && <>
                                            <div className="row mb-3">
                                                <label htmlFor="grade" className="col-3 col-form-label">Lớp</label>
                                                <div className="col-8">
                                                    <input name='grade' required maxLength={30} autoComplete='off'
                                                        type="text" className="form-control" id="grade" defaultValue={user.grade} />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label htmlFor="major" className="col-3 col-form-label">Ngành học</label>
                                                <div className="col-8">
                                                    <input name='major' required maxLength={30} autoComplete='off'
                                                        type="text" className="form-control" id="major" defaultValue={user.major} />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label htmlFor="course" className="col-3 col-form-label">Khoá học</label>
                                                <div className="col-8">
                                                    <input name='course' required maxLength={30} autoComplete='off'
                                                        type="text" className="form-control" id="course" defaultValue={user.course} />
                                                </div>
                                            </div>
                                        </>}
                                        <div className="row mb-3">
                                            <label htmlFor="faculty" className="col-3 col-form-label">Khoa</label>
                                            <div className="col-8">
                                                <input name='faculty' required maxLength={30} autoComplete='off'
                                                    type="text" className="form-control" id="faculty" defaultValue={user.faculty} />
                                            </div>
                                        </div>
                                        {user.role === 1 && <>
                                            <div className="row mb-3">
                                                <label htmlFor="email" className="col-3 col-form-label">Email</label>
                                                <div className="col-8">
                                                    <input name='email' required maxLength={30} autoComplete='off'
                                                        type="text" className="form-control" id="email" defaultValue={user.email} />
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <label htmlFor="phone" className="col-3 col-form-label">Số điện thoại</label>
                                                <div className="col-8">
                                                    <input name='phone' required maxLength={30} autoComplete='off'
                                                        type="text" className="form-control" id="phone" defaultValue={user.phone} />
                                                </div>
                                            </div>
                                        </>}
                                        <div className="text-center">
                                            <button type="submit" className="btn btn-primary">Lưu thông tin</button>
                                        </div>
                                    </form>
                                </div>
                                <div className="tab-pane fade" id="account-change-password">
                                    <form onSubmit={handleChangePassword}>
                                        <div className="row mb-3">
                                            <label htmlFor="currentPassword" className="col-4 col-form-label">Mật khẩu hiện tại</label>
                                            <div className="col-6">
                                                <input name='oldPassword' required maxLength={30} minLength={6} autoComplete='off'
                                                    type="password" className="form-control" id="currentPassword" />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label htmlFor="newPassword" className="col-4 col-form-label">Mật khẩu mới</label>
                                            <div className="col-6">
                                                <input name='newPassword' required maxLength={30} minLength={6} autoComplete='off'
                                                    type="password" className="form-control" id="newPassword" />
                                            </div>
                                        </div>
                                        <div className="row mb-3">
                                            <label htmlFor="renewPassword" className="col-4 col-form-label">Nhập lại mật khẩu mới</label>
                                            <div className="col-6">
                                                <input name='renewPassword' required maxLength={30} minLength={6} autoComplete='off'
                                                    type="password" className="form-control" id="renewPassword" />
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <button type="submit" className="btn btn-primary">Đổi mật khẩu</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
