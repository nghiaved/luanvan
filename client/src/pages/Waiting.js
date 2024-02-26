import React from 'react'
import Layout from "../components/Layout"
import { Link } from 'react-router-dom'

export default function Waiting() {
    return (
        <Layout>
            <div className='text-center'>
                <div className='display-6 text-secondary'>Please update personal information!</div>
                <Link to='/account' className='btn btn-primary mt-4'>Thông tin cá nhân</Link>
                <Link to='/' className='btn btn-secondary mt-4 ms-2'>Trở về trang chủ</Link>
            </div>
        </Layout>
    )
}
