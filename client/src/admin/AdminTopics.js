import React, { useCallback, useEffect, useState } from "react"
import AdminLayout from '../components/AdminLayout'
import { toast } from 'react-toastify'
import { socket } from '../utils/socket'
import axios from "axios"
import { Link } from "react-router-dom"

export default function AdminTopics() {
  const [topics, setTopics] = useState([])
  const [topic, setTopic] = useState(null)

  const fetchTopics = useCallback(async () => {
    await axios.get('http://localhost:8000/api/admin/get-all-topics')
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

  const handleAcceptTopic = async (topic) => {
    await axios.patch(`http://localhost:8000/api/admin/accept-topic/${topic._id}`)
      .then(res => {
        if (res.data.status === true) {
          socket.emit('send-notify', topic.lecturer.username)
          toast.success(res.data.message)
          fetchTopics()
        }
      })
      .catch(err => console.log(err))
  }

  const handleRefuseTopic = async () => {
    await axios.delete(`http://localhost:8000/api/admin/refuse-topic/${topic._id}`)
      .then(res => {
        if (res.data.status === true) {
          socket.emit('send-notify', topic.lecturer.username)
          toast.success(res.data.message)
          fetchTopics()
        }
      })
      .catch(err => console.log(err))
  }

  const checkStatus = (limit, registered) => {
    if (registered === 0) {
      return 'text-black'
    }

    if (limit === registered) {
      return 'text-primary'
    } else {
      return 'text-success'
    }
  }

  return (
    <AdminLayout>
      <div className='display-6'>Trang quản lý đề tài</div>
      {topics.length > 0 ? <>
        <div className="row mt-4">
          {topics.map(topic => (
            <div key={topic._id} className='col-lg-4 mb-4'>
              <div className={`card h-100 ${checkStatus(topic.limit, topic.registered)}`}>
                <div className="card-header">
                  <h6 className="text-nowrap overflow-hidden mb-0">{topic.title}</h6>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-4">
                    <span>{topic.lecturer.fullname}</span>
                    <span>{topic.lecturer.username}</span>
                  </div>
                  <div className='d-flex justify-content-between'>
                    <Link to={`/detail-topic/${topic.slug}`} className='text-info'>Chi tiết</Link>
                    <div>
                      {topic.status === true
                        ? <span className="text-success">Đã xác nhận</span>
                        : <>
                          <button className='btn btn-primary me-2'
                            onClick={() => handleAcceptTopic(topic)}>
                            Xác nhận
                          </button>
                          <button className='btn btn-danger'
                            data-bs-toggle="modal" data-bs-target="#exampleModal"
                            onClick={() => setTopic(topic)}>
                            Từ chối
                          </button>
                        </>}
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  Số lượng đăng ký: {topic.registered}/{topic.limit}
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
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleRefuseTopic}>Xoá</button>
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
