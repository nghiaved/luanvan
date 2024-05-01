import React, { useEffect, useState } from 'react'
import AdminLayout from '../components/layouts/AdminLayout'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Avatar from '../components/profile/Avatar'
import ProfileInfo from '../components/profile/ProfileInfo'

export default function AdminProfile() {
    const { username } = useParams()
    const [user, setUser] = useState({})
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`http://localhost:8000/api/users/get-user/${username}`)
            setUser(res.data.user)
        }
        fetchUser()
    }, [username])

    return (
        <AdminLayout breadcrumb={`Thông tin ${user.role === 1 ? 'giảng viên' : 'sinh viên'}`}>
            <div className='d-flex flex-column align-items-center'>
                <Avatar src={user.avatar} alt={user.fullname} />
                <div style={{ width: '100%', maxWidth: 500 }}>
                    <ProfileInfo user={user} />
                </div>
            </div>
            <div className='text-center'>
                <button className='btn btn-secondary' onClick={() => navigate(-1)}>Quay về trang trước</button>
            </div>
        </AdminLayout>
    )
}
