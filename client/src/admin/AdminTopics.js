import React, { useCallback, useEffect, useState } from "react"
import AdminLayout from '../components/AdminLayout'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from "axios"

export default function AdminTopics() {
  const [topics, setTopics] = useState([])
  const [topicId, setTopicId] = useState(null)

  const fetchTopics = useCallback(async () => {
    await axios.get('http://localhost:8000/api/topics/get-all-topics')
      .then(res => {
        if (res.data.status === true) {
          setTopics(res.data.topics)
        }
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    fetchTopics()
  }, [fetchTopics])

  const handleDeleteTopic = async () => {
    toast.success(topicId)
  }

  return (
    <AdminLayout>
      <div className='display-6'>Trang quản lý đề tài</div>
      {topics.length > 0 ? <>
        <table className="table table-hover mt-4">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên đề tài</th>
              <th scope="col">Tên giảng viên</th>
              <th scope="col">Quản lý</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {topics.map((topic, index) => (
              <tr key={topic._id}>
                <th scope="row">{++index}</th>
                <td>{topic.title}</td>
                <td>{topic.lecturer.fullname}</td>
                <td>
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
        <div className="mt-4">Chưa có đề tài.</div>
      )}
    </AdminLayout>
  )
}
