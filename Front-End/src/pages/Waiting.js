import React, { useEffect } from 'react'
import Layout from "../components/layouts/Layout"
import axios from "axios"
import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

export default function Waiting() {
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            const token = sessionStorage.getItem('token')
            const resUser = await axios.get(`http://localhost:8000/api/users/get-user/${jwtDecode(token).username}`)
            if (resUser.data.status === true && resUser.data.user.status === true) {
                const resToken = await axios.get(`http://localhost:8000/api/users/get-token-by-id/${resUser.data.user._id}`)
                sessionStorage.setItem('token', resToken.data.token)
                navigate('/')
            }
        }
        fetchUser()
    }, [navigate])

    return (
        <Layout>
            <div className='text-center'>
                <h3 className='text-secondary'>Vui lòng cập nhật thông tin cá nhân!</h3>
                <Link to='/account' className='btn btn-warning mt-4'>Cập nhật thông tin</Link>
                <Link to='/' className='btn btn-secondary mt-4 ms-2'>Trở về trang chủ</Link>
            </div>
        </Layout>
    )
}
