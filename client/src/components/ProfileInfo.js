import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

export default function ProfileInfo() {
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
                    <td>{user.username?.toUpperCase()}</td>
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
    )
}
