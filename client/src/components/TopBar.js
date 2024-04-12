import React from 'react'
import { Link } from 'react-router-dom'

export default function TopBar() {
    return (
        <div className='d-flex align-items-center justify-content-between mx-4'>
            <Link to='/'>
                <img style={{ height: 60 }} src='/logo-ctu.png' alt='' />
            </Link>
            <h6 className='mb-0'>Năm thực hiện: <b>2024</b></h6>
        </div>
    )
}
