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

    return (
        <Layout>
            <Link to="/create-topic" className="me-4">Thêm đề tài</Link>
            <Link to="/list-registers">Danh sách đăng ký</Link>
            <div className='display-6 mt-4'>Danh sách đề tài</div>
            {topics.length > 0 ? <>
                <table className="table table-hover mt-4">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tên đề tài</th>
                            <th scope="col">Trạng thái</th>
                            <th scope="col">Quản lý</th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {topics.map((topic, index) => (
                            <tr key={topic._id}>
                                <th scope="row">{++index}</th>
                                <td>{topic.title}</td>
                                <td>
                                    {topic.status === true
                                        ? <span className="text-success">Đã xác nhận</span>
                                        : <span className="text-danger">Chờ xác nhận</span>}
                                </td>
                                <td>
                                    <Link className="me-4" state={topic} to={`/detail-topic/${topic.slug}`}>Chi tiết</Link>
                                    <Link className="me-4" state={topic} to='/update-topic'>Sửa</Link>
                                    <Link data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setTopicId(topic._id)}>Xoá</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
