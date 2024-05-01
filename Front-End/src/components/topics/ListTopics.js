import { Link } from 'react-router-dom'
import React, { useCallback, useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import { toast } from 'react-toastify'
import { useGlobal } from '../../utils/useGlobal'
import convertDesc from '../../utils/convertDesc'
import ModalConfirm from '../modals/ModalConfirm'
import axios from "axios"
import checkStatus from '../../utils/checkStatus'
import Status from '../others/Status'

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
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h3>Danh sách đề tài</h3>
                <div className="text-end">
                    <Link to="/create-topic" className="btn btn-primary">Thêm đề tài</Link>
                </div>
            </div>
            {topics.length > 0 ? <>
                <div className="row mt-4">
                    {topics.map(topic => (
                        <div key={topic._id} className='col-lg-6 mb-4'>
                            <div className={`card h-100 ${checkStatus(topic.limit, topic.registered, 'text-danger')}`}>
                                <div className="card-header">
                                    <div className="d-flex justify-content-between">
                                        <Link className="me-4" state={topic} to={`/detail-topic/${topic.slug}`}>
                                            <b className="me-2">{topic.title}</b> ({topic.registered} / {topic.limit})
                                        </Link>
                                        <div className="card-text text-nowrap">
                                            <Status check={topic.status} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <p className="card-text">
                                        {convertDesc(topic.description)}
                                    </p>
                                    <p className='text-end'>
                                        <Link className="me-4" state={topic} to={`/detail-topic/${topic.slug}`}>
                                            <i className="bi bi-file-text"></i>
                                        </Link>
                                        <Link className="me-4" state={topic} to='/update-topic'>
                                            <i className="bi bi-pencil-square text-warning"></i>
                                        </Link>
                                        <Link data-bs-toggle="modal" data-bs-target='#refuseModal' onClick={() => setTopicId(topic._id)}>
                                            <i className="bi bi-trash-fill text-danger"></i>
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <ModalConfirm
                    id='refuseModal'
                    action='Xoá'
                    type='danger'
                    title='Xoá đề tài'
                    content='Bạn có chắc chắn muốn xoá đề tài này?'
                    func={handleDeleteTopic}
                />
            </> : (
                <div className="mt-4">Bạn chưa thêm đề tài.</div>
            )}
        </>
    )
}
