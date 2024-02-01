import Layout from '../components/Layout'
import { useLocation, useNavigate } from 'react-router-dom'
import React from 'react'
import ReactQuill from 'react-quill'
import { jwtDecode } from 'jwt-decode'

export default function DetailTask() {
    const token = sessionStorage.getItem('token')
    const location = useLocation()
    const task = location.state
    const navigate = useNavigate()

    return (
        <Layout>
            <div className='display-6 mb-4'>Thông tin công việc</div>
            {task ? (
                <div className='mb-4'>
                    <div className='mb-2'>
                        <b className='me-2'>Tên công việc:</b>
                        <i>{task.title}</i>
                    </div>
                    <div className="accordion mb-2">
                        <div className="accordion-item">
                            <h2 className="accordion-header" id="descriptionHeading">
                                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#descriptionTask" aria-expanded="true" aria-controls="descriptionTask">
                                    Mô tả công việc
                                </button>
                            </h2>
                            <div id="descriptionTask" className="accordion-collapse collapse show" aria-labelledby="descriptionHeading" data-bs-parent="#accordionExample">
                                <div className="accordion-body">
                                    <ReactQuill value={task.description} readOnly theme="bubble" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className='mb-4'>Không tìm thấy công việc.</div>
            )}
            {token && jwtDecode(token).role === 1
                ? <></>
                : <button className='btn btn-primary me-2'>Nộp bài</button>
            }
            <button className='btn btn-secondary' onClick={() => navigate(-1)}>Trở lại</button>
        </Layout>
    )
}
