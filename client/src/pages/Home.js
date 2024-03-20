import Layout from "../components/Layout"
import { Link } from 'react-router-dom'
import React, { useCallback, useEffect, useState } from "react"
import axios from "axios"
import { Doughnut } from 'react-chartjs-2'

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

    return (
        <Layout>
            {data.topics?.length > 0 ? (<>
                <div className="d-flex justify-content-between mb-4">
                    <select onChange={(e) => setFilter(e.target.value)} className="form-select home-filter">
                        <option defaultChecked value=''>Tất cả</option>
                        {data.lecturers?.map((item, index) => (
                            <option value={item} key={index}>
                                {item}
                            </option>
                        ))}
                    </select>
                    <input onChange={e => setFilter(e.target.value)} className="form-control home-filter" placeholder="Tìm kiếm..." />
                </div>
                <div className='display-6 mb-4'>Danh sách đề tài</div>
                <div className="row">
                    {data.topics?.filter(item => filter.toLowerCase() === '' ? item
                        : item.title.toLowerCase().includes(filter.toLowerCase())
                        || item.lecturer.fullname.toLowerCase().includes(filter.toLowerCase())
                    ).map(topic => (
                        <div key={topic._id} className='col-lg-6 mb-4'>
                            <div className="card">
                                <div className="card-header">
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
                                        <div style={{ width: 120, height: 120 }}>
                                            <Doughnut data={{
                                                labels: ["Đã đăng ký", "Còn trống",],
                                                datasets: [{
                                                    backgroundColor: ["#3e95cd", "#1c57a5"],
                                                    data: [topic.registered, topic.limit - topic.registered]
                                                }]
                                            }} />
                                            <p style={{ fontSize: 14 }} className="mt-3 text-end">Số lượng: {topic.registered}/{topic.limit}</p>
                                        </div>
                                    </div>
                                    <Link state={topic} to={`/detail-topic/${topic.slug}`}>
                                        <button className="btn btn-outline-primary">Xem thêm</button>
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
