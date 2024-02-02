import Layout from '../components/Layout'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import ReactQuill from 'react-quill'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'
import { saveAs } from 'file-saver'

export default function DetailTask() {
    const token = sessionStorage.getItem('token')
    const location = useLocation()
    const task = location.state
    const navigate = useNavigate()
    const [fileUpload, setFileUpload] = useState(null)
    const [file, setFile] = useState(null)

    const fetchFile = useCallback(async () => {
        const res = await axios.get(`http://localhost:8000/api/files/get-file/${task._id}`)
        if (res.data.status === true) {
            setFile(res.data.file)
        }
    }, [task._id])

    useEffect(() => {
        fetchFile()
    }, [fetchFile])

    const handleSubmitTask = async () => {
        if (!fileUpload) return toast.warning("Vui lòng đăng tải theo yêu cầu")

        const formData = new FormData()
        formData.append("file", fileUpload)
        formData.append("task", task._id)

        await axios.post('http://localhost:8000/api/files/upload-file', formData)
            .then(res => {
                if (res.data.status === true) {
                    toast.success(res.data.message)
                    fetchFile()
                }
            })
            .catch(err => console.log(err))
    }

    const handleDownloadTask = async () => {
        await axios.get('http://localhost:8000/api/files/download-file/' + task._id,
            { responseType: "blob" }
        )
            .then(res => {
                const blob = new Blob([res.data], { type: res.data.type })
                saveAs(blob, file.name)
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
                    <div className='d-flex mb-2'>
                        <div className='me-5'>
                            <b className='me-2'>Ngày bắt đầu:</b>
                            {task.start.substring(0, 10)}
                        </div>
                        <div>
                            <b className='me-2'>Ngày kết thúc:</b>
                            {task.end.substring(0, 10)}
                        </div>
                    </div>
                    {file
                        ? <div className='d-flex text-success mb-2'>
                            <div className='me-1'>
                                <b className='me-1'>Đã đăng tải file</b>
                                {file.name}
                            </div>
                            <div>
                                <b className='me-1'>vào lúc</b>
                                {file.time.substring(0, 10)}
                            </div>
                        </div>
                        : jwtDecode(token).role === 1
                            ? <div className='mb-2'>
                                <span className='text-danger'>Sinh viên chưa đăng tải nội dung</span>
                            </div>
                            : <div className="mb-2">
                                <label htmlFor="formFile" className="form-label">Đăng tải nội dung theo yêu cầu</label>
                                <input onChange={e => setFileUpload(e.target.files[0])} className="form-control" type="file" id="formFile" />
                            </div>}
                </div>
            ) : (
                <div className='mb-4'>Không tìm thấy công việc.</div>
            )}
            {token && jwtDecode(token).role === 1
                ? file
                    ? <button onClick={handleDownloadTask} className='btn btn-warning me-2'>Tải file</button>
                    : <button onClick={handleExtendTask} className='btn btn-info me-2'>Gia hạn</button>
                : file
                    ? <button className='btn btn-success me-2 pe-none'>Đã nộp</button>
                    : <button onClick={handleSubmitTask} className='btn btn-primary me-2'>Nộp bài</button>
            }
            <button className='btn btn-secondary' onClick={() => navigate(-1)}>Trở lại</button>
        </Layout>
    )
}
