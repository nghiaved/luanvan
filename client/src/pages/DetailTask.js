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
    const [task, setTask] = useState(location.state)
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

    const handleExtendTask = async (e) => {
        e.preventDefault()
        if (!e.target.days) return

        const end = new Date(task.end)
        const days = end.setDate(end.getDate() + parseInt(e.target.days.value))
        await axios.patch('http://localhost:8000/api/tasks/extend-task/' + task._id, { days: new Date(days) })
            .then(res => {
                if (res.data.status === true) {
                    setTask(res.data.task)
                    e.target.close.click()
                    toast.success(res.data.message)
                }
            })
            .catch(err => console.log(err))
    }

    const checkExpired = (end) => {
        const timeRemaining = new Date(end).getTime() - Date.now()
        let days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24))
        return ++days > 0 ? false : true
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
                                <input disabled={checkExpired(task.end)} onChange={e => setFileUpload(e.target.files[0])} className="form-control" type="file" id="formFile" />
                            </div>}
                </div>
            ) : (
                <div className='mb-4'>Không tìm thấy công việc.</div>
            )}
            {token && jwtDecode(token).role === 1
                ? file
                    ? <button onClick={handleDownloadTask} className='btn btn-warning me-2'>Tải file</button>
                    : <>
                        <button className='btn btn-info me-2' data-bs-toggle="modal" data-bs-target="#exampleModal">Gia hạn</button>
                        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <form onSubmit={handleExtendTask} className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Gia hạn công việc</h5>
                                        <button name='close' type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row">
                                            <label htmlFor="colFormLabel" className="col col-form-label">Nhập số ngày gia hạn: </label>
                                            <div className="col">
                                                <input required name='days' type="number" className="form-control" id="colFormLabel" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="reset" className="btn btn-secondary" data-bs-dismiss="modal">Trở lại</button>
                                        <button type="submit" className="btn btn-primary">Gia hạn</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                : file
                    ? <button className='btn btn-success me-2 pe-none'>Đã nộp</button>
                    : checkExpired(task.end)
                        ? <button className='btn btn-danger me-2 pe-none'>Đã hết hạn</button>
                        : <button onClick={handleSubmitTask} className='btn btn-primary me-2'>Nộp bài</button>
            }
            <button className='btn btn-secondary' onClick={() => navigate(-1)}>Trở lại</button>
        </Layout>
    )
}
