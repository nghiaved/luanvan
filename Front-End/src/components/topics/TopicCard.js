import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from '../profile/Avatar'
import convertDesc from '../../utils/convertDesc'
import checkStatus from '../../utils/checkStatus'

export default function TopicCard({ topic }) {
    return (
        <div className={`card ${checkStatus(topic.limit, topic.registered, 'full-registered')}`}>
            <div className="card-header text-end">
                <Link to={`/profile/${topic.lecturer.username}`}>
                    {topic.lecturer.fullname}
                </Link>
            </div>
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <div>
                        <h5 className="card-title">
                            <Link state={topic} to={`/detail-topic/${topic.slug}`}>
                                {topic.title}
                            </Link>
                        </h5>
                        <p className="card-text">{convertDesc(topic.description)}</p>
                    </div>
                    <div className="ms-3">
                        <Avatar src={topic.lecturer.avatar} alt={topic.lecturer.fullname} />
                        <p style={{ fontSize: 14 }} className="text-nowrap text-end">Số lượng: {topic.registered}/{topic.limit}</p>
                    </div>
                </div>
                <Link state={topic} to={`/detail-topic/${topic.slug}`}>
                    <button disabled={topic.limit === topic.registered} className="btn btn-outline-primary">Xem thêm</button>
                </Link>
            </div>
        </div>
    )
}
