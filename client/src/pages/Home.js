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
                    const topics = res.data.topics
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
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Tên đề tài</th>
                            <th scope="col">Giảng viên</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody className="table-group-divider">
                        {data.topics?.filter(item => filter.toLowerCase() === '' ? item
                            : item.title.toLowerCase().includes(filter.toLowerCase())
                            || item.lecturer.fullname.toLowerCase().includes(filter.toLowerCase())
                        ).map((topic, index) => (
                            <tr key={topic._id}>
                                <th scope="row">{++index}</th>
                                <td>{topic.title}</td>
                                <td>{topic.lecturer.fullname}</td>
                                <td>
                                    <Link state={topic} to={`/detail-topic/${topic.slug}`}>Chi tiết</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </>) : (
                <div className="mt-4">Không tìm thấy đề tài</div>
            )}
        </Layout>
    )
}
