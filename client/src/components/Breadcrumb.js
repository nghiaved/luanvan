import React from 'react'
import { Link } from 'react-router-dom'

export default function Breadcrumb({ name }) {
    return (
        name && (
            <nav className='m-4'>
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to='/'>Trang chủ</Link></li>
                    <li className="breadcrumb-item">{name}</li>
                </ol>
            </nav>
        )
    )
}
