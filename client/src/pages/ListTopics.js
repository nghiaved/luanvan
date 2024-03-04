import Layout from "../components/Layout"
import { Link } from 'react-router-dom'
import React, { useCallback, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { toast } from 'react-toastify'
import { useGlobal } from '../utils/useGlobal'
import axios from "axios"

export default function ListTopics() {
    const token = sessionStorage.getItem('token')
    const [topics, setTopics] = useState([])
    const [topicId, setTopicId] = useState(null)
    const [fetchAgain, setFetchAgain] = useState(false)
    const [state] = useGlobal()

    const fetchTopics = useCallback(async (userId) => {
        await axios.get('http://localhost:8000/api/topics/get-topics-by-lecturer/' + userId)
            .then(res => {
                if (res.data.status === true) {
                    setTopics(res.data.topics)
                }
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        if (state.fetchAgain !== fetchAgain) {
            setFetchAgain(state.fetchAgain)
        }

        fetchTopics(jwtDecode(token)._id)
    }, [fetchTopics, token, fetchAgain, state.fetchAgain])

    const handleDeleteTopic = async () => {
        await axios.delete(`http://localhost:8000/api/topics/delete-topic/${topicId}`)
            .then(res => {
                if (res.data.status === true) {
                    toast.success(res.data.message)
                    fetchTopics(jwtDecode(token)._id)
                }
            })
            .catch(err => console.log(err))
    }

    const convertDesc = desc => {
        desc = desc.replace(/<[^>]*>/g, " ")
        if (desc.length < 50) return desc
        desc = desc.substring(0, 50).concat(" ...")
        return desc
    }

    return (
        <Layout>
            <Link to="/create-topic" className="me-4">Thêm đề tài</Link>
            <Link to="/list-registers">Danh sách đăng ký</Link>
            <div className='display-6 mt-4'>Danh sách đề tài</div>
            {topics.length > 0 ? <>
                <div className="row mt-4">
                    {topics.map(topic => (
                        <div key={topic._id} className='col-lg-6 mb-4'>
                            <div className="card">
                                <div className="card-header">
                                    <div className="d-flex justify-content-between">
                                        <b>{topic.title}</b>
                                        <div className="card-text">
                                            {topic.status === true
                                                ? <span className="text-success">Đã xác nhận</span>
                                                : <span className="text-danger">Chờ xác nhận</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <p className="card-text">
                                        {convertDesc(topic.description)}
                                    </p>
                                    <p className='text-end'>
                                        <Link className="me-4" state={topic} to={`/detail-topic/${topic.slug}`}>Chi tiết</Link>
                                        <Link className="me-4" state={topic} to='/update-topic'>Sửa</Link>
                                        <Link data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setTopicId(topic._id)}>Xoá</Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Xoá đề tài</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Bạn có chắc chắn muốn xoá đề tài này?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Trở lại</button>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDeleteTopic}>Xoá</button>
                            </div>
                        </div>
                    </div>
                </div>
            </> : (
                <div className="mt-4">Bạn chưa thêm đề tài.</div>
            )}
        </Layout>
    )
}
