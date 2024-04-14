import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Avatar from '../components/Avatar'
import ProfileInfo from '../components/ProfileInfo'

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
        <Layout breadcrumb={`Thông tin ${user.role === 1 ? 'giảng viên' : 'sinh viên'}`}>
            <div className='d-flex flex-column align-items-center'>
                <Avatar src={user.avatar} alt={user.fullname} />
                <div style={{ width: '100%', maxWidth: 500 }}>
                    <ProfileInfo user={user} />
                </div>
            </div>
        </Layout>
    )
}
