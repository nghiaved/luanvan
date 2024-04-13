import React from 'react'
import { Link } from 'react-router-dom'

export default function ListTasks({ data }) {
    const timeRemaining = (date) => {
        const timeRemaining = new Date(date).getTime() - Date.now()
        let days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
        return ++days > 0 ? `Còn ${days} ngày` : 'Đã hết hạn'
    }

    const convertDesc = desc => {
        desc = desc.replace(/<[^>]*>/g, " ")
        if (desc.length < 50) return desc
        desc = desc.substring(0, 50).concat(" ...")
        return desc
    }

    return (
        <>
            <h3>Danh sách công việc</h3>
            <div className="row my-4">
                {data.map(task => (
                    <div key={task._id} className='col-lg-6 mb-4'>
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex justify-content-between">
                                    <b>{task.title}</b>
                                    <div className="card-text">
                                        {task.status
                                            ? <span className='text-success'>Đã nộp {task.points && `(${task.points}%)`} </span>
                                            : <span className='text-danger'>{timeRemaining(task.end)}</span>}
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <p className="card-text">{convertDesc(task.description)}</p>
                                <hr />
                                <div className='d-flex justify-content-between align-items-center'>
                                    <div>{task.start.substring(0, 10)} | {task.end.substring(0, 10)}</div>
                                    <Link state={task} to={`/detail-task`}>Chi tiết</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
