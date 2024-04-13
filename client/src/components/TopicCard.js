import React from 'react'
import { Link } from 'react-router-dom'

export default function TopicCard({ topic }) {
    const convertDesc = desc => {
        desc = desc.replace(/<[^>]*>/g, " ")
        if (desc.length < 50) return desc
        desc = desc.substring(0, 50).concat(" ...")
        return desc
    }

    const checkStatus = (limit, registered) => {
        if (registered === 0) {
            return 'text-black'
        }

        if (limit === registered) {
            return 'full-registered'
        } else {
            return 'text-success'
        }
    }

    return (
        <div className={`card ${checkStatus(topic.limit, topic.registered)}`}>
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
                        <img className='img-avatar' src={topic.lecturer.avatar ? topic.lecturer.avatar : "/no-avatar.png"} alt={topic.lecturer.fullname} />
                        <p style={{ fontSize: 14 }} className="mt-3 text-nowrap text-end">Số lượng: {topic.registered}/{topic.limit}</p>
                    </div>
                </div>
                <Link state={topic} to={`/detail-topic/${topic.slug}`}>
                    <button disabled={topic.limit === topic.registered} className="btn btn-outline-primary">Xem thêm</button>
                </Link>
            </div>
        </div>
    )
}
