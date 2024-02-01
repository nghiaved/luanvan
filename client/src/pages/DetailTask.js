import Layout from '../components/Layout'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'

export default function DetailTask() {
    const token = sessionStorage.getItem('token')
    const location = useLocation()
    const task = location.state
    const navigate = useNavigate()
    const [file, setFile] = useState(null)

    const handleSubmitTask = async () => {
        if (!file) return toast.warning("Vui lòng đăng tải theo yêu cầu")

        const formData = new FormData()
        formData.append("file", file)
        formData.append("task", task._id)

        await axios.post('http://localhost:8000/api/files/upload-file', formData)
            .then(res => {
                if (res.data.status === true) {
                    toast.success(res.data.message)
                    navigate('/student')
                }
            })
            .catch(err => console.log(err))
    }

    const handleDownloadTask = async () => {
        await axios.get('http://localhost:8000/api/files/download-file/' + task._id)
            .then(res => {
                const link = document.createElement("a")
                link.href = res.data.path
                document.body.appendChild(link)
                link.click()
                if (res.data.status === true) {
                    toast.success(res.data.message)
                }
            })
            .catch(err => console.log(err))
    }

    const handleExtendTask = async () => {
        toast.success('Handle')
    }

    return (
        <Layout>
            {task ? (
                <div className='mb-4'>
                    <div className='display-6 mb-4'>Thông tin công việc</div>
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
                    <div className="mb-2">
                        <label htmlFor="formFile" className="form-label">Đăng tải nội dung theo yêu cầu</label>
                        <input disabled={task.status} onChange={e => setFile(e.target.files[0])} className="form-control" type="file" id="formFile" />
                    </div>
                </div>
            ) : (
                <div className='mb-4'>Không tìm thấy công việc.</div>
            )}
            {token && jwtDecode(token).role === 1
                ? task.status === true
                    ? <button onClick={handleDownloadTask} className='btn btn-warning me-2'>Tải về</button>
                    : <button onClick={handleExtendTask} className='btn btn-info me-2'>Gia hạn</button>
                : task.status === true
                    ? <button className='btn btn-success me-2 pe-none'>Đã nộp</button>
                    : <button onClick={handleSubmitTask} className='btn btn-primary me-2'>Nộp bài</button>
            }
            <button className='btn btn-secondary' onClick={() => navigate(-1)}>Trở lại</button>
        </Layout>
    )
}
