import Layout from '../components/Layout'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { socket } from '../utils/socket'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'
import { saveAs } from 'file-saver'
import { useGlobal } from '../utils/useGlobal'
import Description from '../components/Description'

export default function DetailTask() {
    const token = sessionStorage.getItem('token')
    const location = useLocation()
    const [task, setTask] = useState(location.state)
    const navigate = useNavigate()
    const [fileUpload, setFileUpload] = useState(null)
    const [file, setFile] = useState(null)
    const [state] = useGlobal()
    const [fetchAgain, setFetchAgain] = useState(false)

    const fetchFile = useCallback(async () => {
        const res = await axios.get(`http://localhost:8000/api/files/get-file/${task._id}`)
        if (res.data.status === true) {
            setFile(res.data.file)
        }
    }, [task._id])

    useEffect(() => {
        if (state.fetchAgain !== fetchAgain) {
            setFetchAgain(state.fetchAgain)
        }

        fetchFile()
    }, [fetchFile, fetchAgain, state.fetchAgain])

    const handleSubmitTask = async () => {
        if (!fileUpload) return toast.warning("Vui lòng đăng tải theo yêu cầu")

        const formData = new FormData()
        formData.append("file", fileUpload)
        formData.append("task", task._id)

        await axios.post('http://localhost:8000/api/files/upload-file', formData)
            .then(res => {
                if (res.data.status === true) {
                    socket.emit('send-notify', task.lecturer.username)
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
                    socket.emit('send-notify', task.student.username)
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

    const handleEvaluateTask = async (e) => {
        e.preventDefault()
        const points = e.target.points.value
        const note = e.target.note.value
        await axios.patch('http://localhost:8000/api/tasks/evaluate-task/' + task._id, { points, note })
            .then(res => {
                if (res.data.status === true) {
                    setTask(task => ({ ...task, points }))
                    socket.emit('send-notify', task.student.username)
                    e.target.close.click()
                    toast.success(res.data.message)
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <Layout>
            {task ? (
                <div className='mb-4'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <h3 className='mb-4'>Thông tin công việc</h3>
                        <div className='text-end'>
                            {task.points
                                ? <>
                                    <h4 className='text-success'>Đã hoàn thành ({task.points}%)!</h4>
                                    <p>{task.note && `Ghi chú: ${task.note}`}</p>
                                </>
                                : <h4 className='text-danger'>Chưa có đánh giá!</h4>}
                        </div>
                    </div>
                    <div className='mb-2'>
                        <b className='me-2'>Tên công việc:</b>
                        <i>{task.title}</i>
                    </div>
                    <Description desc={task.description} />
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
                    ? <>
                        <button onClick={handleDownloadTask} className='btn btn-warning me-2'>Tải file</button>
                        <button className='btn btn-info me-2' data-bs-toggle="modal" data-bs-target="#exampleModal">Đánh giá {task.points && 'lại'}</button>
                        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog">
                                <form onSubmit={handleEvaluateTask} className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Đánh giá công việc</h5>
                                        <button name='close' type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="row mb-3">
                                            <label htmlFor="colFormLabel" className="col col-form-label">Nhập số điểm (1 - 100): </label>
                                            <div className="col">
                                                <input required name='points' type="number" min={0} max={100} className="form-control" id="colFormLabel" />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <label htmlFor="colFormLabel" className="col col-form-label">Ghi chú: </label>
                                            <div className="col">
                                                <textarea required name='note' type="text" className="form-control" id="colFormLabel" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="reset" className="btn btn-secondary" data-bs-dismiss="modal">Trở lại</button>
                                        <button type="submit" className="btn btn-primary">Đánh giá</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
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
                                                <input required name='days' type="number" min={0} className="form-control" id="colFormLabel" />
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
