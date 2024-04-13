import Layout from "../components/Layout"
import { Link } from 'react-router-dom'
import React, { useCallback, useEffect, useState } from "react"
import axios from "axios"

export default function Home() {
    const [data, setData] = useState({})
    const [filter, setFilter] = useState('')

    const fetchTopics = useCallback(async () => {
        await axios.get('http://localhost:8000/api/topics/get-all-topics')
            .then(res => {
                if (res.data.status === true) {
                    const topics = res.data.topics.filter(item => item.status === true)
                    const lecturers = topics.reduce(
                        (unique, item) => unique.includes(item.lecturer.fullname)
                            ? unique : [...unique, item.lecturer.fullname]
                        , []
                    )
                    setData({ topics, lecturers })
                }
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        fetchTopics()
    }, [fetchTopics])

    const convertDesc = desc => {
        desc = desc.replace(/<[^>]*>/g, " ")
        if (desc.length < 50) return desc
        desc = desc.substring(0, 50).concat(" ...")
        return desc
    }

    const checkStatus = (limit, registered) => {
        if (registered === 0) {
            return 'text-black'
        }

        if (limit === registered) {
            return 'full-registered'
        } else {
            return 'text-success'
        }
    }

    return (
        <Layout>
            <h4 className="text-danger">Hiện tại, bạn chưa đăng ký đề tài nào!</h4>
            {data.topics?.length > 0 ? (<>
                <div className="d-flex justify-content-between my-4">
                    <select onChange={(e) => setFilter(e.target.value)} className="form-select home-filter">
                        <option defaultChecked value=''>Tất cả</option>
                        {data.lecturers?.map((item, index) => (
                            <option value={item} key={index}>{item}</option>
                        ))}
                    </select>
                    <input onChange={e => setFilter(e.target.value)} className="form-control home-filter" placeholder="Tìm kiếm..." />
                </div>
                <h3 className='mb-4'>Danh sách đề tài</h3>
                <div className="row">
                    {data.topics?.filter(item => filter.toLowerCase() === '' ? item
                        : item.title.toLowerCase().includes(filter.toLowerCase())
                        || item.lecturer.fullname.toLowerCase().includes(filter.toLowerCase())
                    ).map(topic => (
                        <div key={topic._id} className='col-lg-6 mb-4'>
                            <div className={`card ${checkStatus(topic.limit, topic.registered)}`}>
                                <div className="card-header text-end">
                                    <Link to={`/profile/${topic.lecturer.username}`}>
                                        {topic.lecturer.fullname}
                                    </Link>
                                </div>
                                <div className="card-body">
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            <h5 className="card-title">
                                                <Link state={topic} to={`/detail-topic/${topic.slug}`}>
                                                    {topic.title}
                                                </Link>
                                            </h5>
                                            <p className="card-text">{convertDesc(topic.description)}</p>
                                        </div>
                                        <div className="ms-3">
                                            <img className='img-avatar' src={topic.lecturer.avatar ? topic.lecturer.avatar : "/no-avatar.png"} alt={topic.lecturer.fullname} />
                                            <p style={{ fontSize: 14 }} className="mt-3 text-nowrap text-end">Số lượng: {topic.registered}/{topic.limit}</p>
                                        </div>
                                    </div>
                                    <Link state={topic} to={`/detail-topic/${topic.slug}`}>
                                        <button disabled={topic.limit === topic.registered} className="btn btn-outline-primary">Xem thêm</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>) : (
                <div className="mt-4">Không tìm thấy đề tài</div>
            )}
        </Layout>
    )
}
