import React from 'react'
import { Link } from 'react-router-dom'
import Description from '../others/Description'

export default function TopicInfo({ title, desc, lecturer }) {
    return (
        <>
            <div className='mb-2'>
                <b className='me-2'>Tên đề tài:</b>
                <i>{title}</i>
            </div>
            <Description desc={desc} />
            <div className='mb-2'>
                <b className='me-2'>Giảng viên hướng dẫn:</b>
                <Link to={`/profile/${lecturer?.username}`}>{lecturer?.fullname} {lecturer?.username}</Link>
            </div>
        </>
    )
}
