import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function Profile() {
    const { username } = useParams()
    const [user, setUser] = useState({})

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`http://localhost:8000/api/users/get-user/${username}`)
            setUser(res.data.user)
        }
        fetchUser()
    }, [username])

    return (
        <Layout>
            <div className='d-flex flex-column align-items-center'>
                <img className='img-avatar mb-2' src={user.avatar ? user.avatar : "/no-avatar.png"} alt={user.fullname} />
                <table className="table" style={{ maxWidth: 500 }}>
                    <thead>
                        <tr>
                            <th colSpan={2} scope="col">
                                <h3 className='text-center'>
                                    {user.fullname}
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
        </Layout>
    )
}
