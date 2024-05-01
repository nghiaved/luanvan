import Layout from "../components/layouts/Layout"
import React, { useCallback, useEffect, useState } from "react"
import axios from "axios"
import TopicCard from "../components/topics/TopicCard"

export default function Home() {
    const [data, setData] = useState({})
    const [filter, setFilter] = useState('')

    const fetchTopics = useCallback(async () => {
        await axios.get('http://localhost:8000/api/topics/get-all-topics')
            .then(res => {
                if (res.data.status === true) {
                    const topics = res.data.topics.filter(item => item.status === true && item.registered !== item.limit)
                    const topicsFull = res.data.topics.filter(item => item.status === true && item.registered === item.limit)
                    const lecturers = topics.reduce(
                        (unique, item) => unique.includes(item.lecturer.fullname)
                            ? unique : [...unique, item.lecturer.fullname]
                        , []
                    )
                    setData({ topics, topicsFull, lecturers })
                }
            })
            .catch(err => console.log(err))
    }, [])

    useEffect(() => {
        fetchTopics()
    }, [fetchTopics])

    return (
        <Layout>
            <h4 className="text-danger">Hiện tại, bạn chưa thực hiện đề tài nào!</h4>
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
                            <TopicCard topic={topic} />
                        </div>
                    ))}
                    {filter === '' && data.topicsFull?.map(topic => (
                        <div key={topic._id} className='col-lg-6 mb-4'>
                            <TopicCard topic={topic} />
                        </div>
                    ))}
                </div>
            </>) : (
                <div className="mt-4">Không tìm thấy đề tài</div>
            )}
        </Layout>
    )
}
