import React, { useCallback, useEffect, useState } from "react"
import AdminLayout from '../components/layouts/AdminLayout'
import Avatar from '../components/profile/Avatar'
import ProfileInfo from '../components/profile/ProfileInfo'
import ModalConfirm from '../components/modals/ModalConfirm'
import { toast } from 'react-toastify'
import axios from "axios"

export default function AdminLecturers() {
  const [lecturers, setLecturers] = useState([])
  const [lecturer, setLecturer] = useState(null)
  const [filter, setFilter] = useState('')

  const fetchLecturers = useCallback(async () => {
    await axios.get('http://localhost:8000/api/admin/get-all-lecturers')
      .then(res => {
        if (res.data.status === true) {
          setLecturers(res.data.lecturers)
        }
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    fetchLecturers()
  }, [fetchLecturers])

  const handleAcceptLecturer = async (lecturer) => {
    await axios.patch(`http://localhost:8000/api/admin/accept-user/${lecturer._id}`)
      .then(res => {
        if (res.data.status === true) {
          toast.success(res.data.message)
          fetchLecturers()
        }
      })
      .catch(err => console.log(err))
  }

  const handleRefuseLecturer = async () => {
    await axios.delete(`http://localhost:8000/api/admin/refuse-user/${lecturer._id}`)
      .then(res => {
        if (res.data.status === true) {
          toast.success(res.data.message)
          fetchLecturers()
        }
      })
      .catch(err => console.log(err))
  }

  const handleClockLecturer = async () => {
    await axios.patch(`http://localhost:8000/api/admin/clock-user/${lecturer._id}`)
      .then(res => {
        if (res.data.status === true) {
          toast.success(res.data.message)
          fetchLecturers()
        }
      })
      .catch(err => console.log(err))
  }

  const handleUnclockLecturer = async (id) => {
    await axios.patch(`http://localhost:8000/api/admin/unclock-user/${id}`)
      .then(res => {
        if (res.data.status === true) {
          toast.success(res.data.message)
          fetchLecturers()
        }
      })
      .catch(err => console.log(err))
  }

  const handleFilter = item => {
    if (filter === '1') return item.status === true
    if (filter === '2') return item.status === false
    return filter.toLowerCase() === '' ? item
      : item.username.toLowerCase().includes(filter.toLowerCase())
      || item.fullname.toLowerCase().includes(filter.toLowerCase())
  }

  return (
    <AdminLayout breadcrumb='Giảng viên'>
      <div className="d-flex justify-content-between align-items-center">
        <h4>Danh sách giảng viên ({lecturers.filter(item => handleFilter(item)).length})</h4>
        <div className="flex-fill d-flex justify-content-end gap-4">
          <select onChange={(e) => setFilter(e.target.value)} className="form-select home-filter">
            <option defaultChecked value=''>Tất cả</option>
            <option value='1'>Đã xác nhận</option>
            <option value='2'>Chờ phản hồi</option>
          </select>
          <input onChange={e => setFilter(e.target.value)} className="form-control home-filter" placeholder="Tìm kiếm..." />
        </div>
      </div>
      {lecturers.length > 0 ? <>
        <div className="row mt-4">
          {lecturers.filter(item => handleFilter(item)).map(lecturer => (
            <div key={lecturer._id} className='col-lg-4 mb-4'>
              <div className="card">
                <div className="card-header">
                  <div className='d-flex justify-content-between'>
                    <b>{lecturer.fullname}</b>
                    <span>{lecturer.username.toUpperCase()}</span>
                  </div>
                </div>
                <div className="card-body">
                  <Avatar src={lecturer.avatar} alt={lecturer.fullname} />
                  <div className='d-flex justify-content-between'>
                    <button className="btn text-info"
                      data-bs-toggle="modal" data-bs-target="#infoModal"
                      onClick={() => setLecturer(lecturer)}>
                      Chi tiết
                    </button>
                    <div>
                      {lecturer.status === true
                        ? lecturer.isActive ? <>
                          <span className="text-success">Hoạt động</span>
                          <button className='btn btn-sm btn-danger ms-2'
                            data-bs-toggle="modal" data-bs-target="#clockModal"
                            onClick={() => setLecturer(lecturer)}>
                            Khoá
                          </button>
                        </> : <>
                          <span className="text-danger">Đang khoá</span>
                          <button className='btn btn-sm btn-success ms-2'
                            onClick={() => handleUnclockLecturer(lecturer._id)}>
                            Mở lại
                          </button>
                        </>
                        : <>
                          <button className='btn btn-sm btn-primary me-2'
                            onClick={() => handleAcceptLecturer(lecturer)}>
                            Xác nhận
                          </button>
                          <button className='btn btn-sm btn-danger'
                            data-bs-toggle="modal" data-bs-target="#refuseModal"
                            onClick={() => setLecturer(lecturer)}>
                            Từ chối
                          </button>
                        </>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="modal fade" id="infoModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                {lecturer && <ProfileInfo user={lecturer} />}
              </div>
            </div>
          </div>
        </div>
        <ModalConfirm
          id='refuseModal'
          action='Xoá'
          type='danger'
          title='Xoá giảng viên'
          content='Bạn có chắc chắn muốn xoá giảng viên này?'
          func={handleRefuseLecturer}
        />
        <ModalConfirm
          id='clockModal'
          action='Khoá'
          type='danger'
          title='Khoá giảng viên'
          content='Bạn có chắc chắn muốn khoá giảng viên này?'
          func={handleClockLecturer}
        />
      </> : (
        <div className="mt-4">Chưa có giảng viên.</div>
      )}
    </AdminLayout>
  )
}
