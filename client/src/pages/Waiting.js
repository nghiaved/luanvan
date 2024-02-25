import React from 'react'
import Layout from "../components/Layout"
import { Link } from 'react-router-dom'

export default function Waiting() {
    return (
        <Layout>
            <div className='text-center'>
                <div className='display-6 text-secondary'>Waiting for acceptance</div>
                <Link to='/' className='btn btn-secondary mt-4'>Trang chủ</Link>
            </div>
        </Layout>
    )
}
