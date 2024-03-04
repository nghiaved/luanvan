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

    return (
        <Layout>
            {data.topics?.length > 0 ? (<>
                <div className="d-flex justify-content-between mb-4">
                    <select onChange={(e) => setFilter(e.target.value)} className="form-select me-4 w-25">
                        <option defaultChecked value=''>Tất cả</option>
                        {data.lecturers?.map((item, index) => (
                            <option value={item} key={index}>
                                {item}
                            </option>
                        ))}
                    </select>
                    <input onChange={e => setFilter(e.target.value)} className="form-control w-25" placeholder="Tìm kiếm..." />
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
                                    {topic.lecturer.fullname}
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{topic.title}</h5>
                                    <p className="card-text">
                                        {convertDesc(topic.description)}
                                    </p>
                                    <p className='text-end'>
                                        <Link state={topic} to={`/detail-topic/${topic.slug}`}>Chi tiết</Link>
                                    </p>
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
