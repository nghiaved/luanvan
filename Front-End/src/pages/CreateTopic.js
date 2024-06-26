import Layout from '../components/layouts/Layout'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import ReactQuill from 'react-quill'
import React, { useRef } from 'react'

export default function CreateTopic() {
    const navigate = useNavigate()
    const location = useLocation()
    const topic = location.state
    const quillRef = useRef(null)

    const handleCreateTopic = async (e) => {
        e.preventDefault()
        const description = quillRef.current.value
        if (!description
            .replaceAll("<p>", "").replaceAll("</p>", "")
            .replaceAll("<br>", "").replaceAll("<br/>", "").trim())
            return toast.error('Vui lòng thêm mô tả đề tài!')

        const token = sessionStorage.getItem('token')
        const data = {
            title: e.target.title.value,
            limit: parseInt(e.target.limit.value),
            description,
            lecturer: jwtDecode(token)._id
        }
        await axios.post('http://localhost:8000/api/topics/create-topic', data)
            .then(res => {
                if (res.data.status === true) {
                    toast.success(res.data.message)
                    navigate('/lecturer')
                }
            })
            .catch(err => console.log(err))
    }

    const handleUpdateTopic = async (e) => {
        e.preventDefault()
        const description = quillRef.current.value
        if (!description
            .replaceAll("<p>", "").replaceAll("</p>", "")
            .replaceAll("<br>", "").replaceAll("<br/>", "").trim())
            return toast.error('Vui lòng thêm mô tả đề tài!')

        const data = {
            title: e.target.title.value,
            limit: parseInt(e.target.limit.value),
            description
        }
        await axios.put(`http://localhost:8000/api/topics/update-topic/${topic._id}`, data)
            .then(res => {
                if (res.data.status === true) {
                    toast.success(res.data.message)
                    navigate('/lecturer')
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <Layout breadcrumb={topic ? 'Cập nhật đề tài' : 'Thêm đề tài'}>
            <h3>{topic ? 'Cập nhật' : 'Thêm'} đề tài</h3>
            <form className='mt-4' onSubmit={topic ? handleUpdateTopic : handleCreateTopic}>
                <div className='d-flex gap-3 mb-3'>
                    <div className="flex-fill">
                        <label htmlFor="title" className="form-label">Tên đề tài</label>
                        <input type="text" className="form-control" id="title"
                            defaultValue={topic?.title} name="title" autoComplete="off" required />
                    </div>
                    <div>
                        <label htmlFor="limit" className="form-label">Số lượng tối đa</label>
                        <input type="number" className="form-control" id="limit" min={1} max={4}
                            defaultValue={topic?.limit || 4} name="limit" autoComplete="off" required />
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Mô tả đề tài</label>
                    <ReactQuill defaultValue={topic?.description} ref={quillRef} theme="snow" />
                </div>
                <button className='btn btn-primary' type='submit'>{topic ? 'Cập nhật' : 'Thêm'} đề tài</button>
                <button type='reset' className='btn btn-secondary ms-2' onClick={() => navigate(-1)}>Trở lại</button>
            </form>
        </Layout>
    )
}
