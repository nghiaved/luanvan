import React, { useCallback, useEffect, useState } from "react"
import AdminLayout from '../components/AdminLayout'
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

  const handleFilter = item => {
    if (filter === '1') return item.status === true
    if (filter === '2') return item.status === false
    return filter.toLowerCase() === '' ? item
      : item.username.toLowerCase().includes(filter.toLowerCase())
      || item.fullname.toLowerCase().includes(filter.toLowerCase())
  }

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center">
        <h3>Trang quản lý giảng viên</h3>
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
                  <img className='img-avatar mb-3' src={lecturer.avatar ? lecturer.avatar : "/no-avatar.png"} alt={lecturer.fullname} />
                  <div className='d-flex justify-content-between'>
                    <button className="btn text-info"
                      data-bs-toggle="modal" data-bs-target="#infoModal"
                      onClick={() => setLecturer(lecturer)}>
                      Chi tiết
                    </button>
                    <div>
                      {lecturer.status === true
                        ? <span className="text-success">Đã xác nhận</span>
                        : <>
                          <button className='btn btn-primary me-2'
                            onClick={() => handleAcceptLecturer(lecturer)}>
                            Xác nhận
                          </button>
                          <button className='btn btn-danger'
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
        <div className="modal fade" id="infoModal" tabIndex="-1" aria-labelledby="infoModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                <table className="table">
                  <thead>
                    <tr>
                      <th colSpan={2} scope="col">
                        <h3 className='text-center'>
                          Thông tin cá nhân
                        </h3>
                      </th>
                    </tr>
                  </thead>
                  {lecturer &&
                    <tbody className="table-group-divider">
                      <tr>
                        <th scope="row">Mã số CB</th>
                        <td>{lecturer.username}</td>
                      </tr>
                      <tr>
                        <th scope="row">Họ tên</th>
                        <td>{lecturer.fullname}</td>
                      </tr>
                      <tr>
                        <th scope="row">Ngày sinh</th>
                        <td>{lecturer.birth}</td>
                      </tr>
                      <tr>
                        <th scope="row">Giới tính</th>
                        <td>{lecturer.sex}</td>
                      </tr>
                      <tr>
                        <th scope="row">Khoa</th>
                        <td>{lecturer.faculty}</td>
                      </tr>
                      <tr>
                        <th scope="row">Email</th>
                        <td>{lecturer.email}</td>
                      </tr>
                      <tr>
                        <th scope="row">Số điện thoại</th>
                        <td>{lecturer.phone}</td>
                      </tr>
                    </tbody>}
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade" id="refuseModal" tabIndex="-1" aria-labelledby="refuseModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="refuseModalLabel">Xoá giảng viên</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                Bạn có chắc chắn muốn xoá giảng viên này?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Trở lại</button>
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleRefuseLecturer}>Xoá</button>
              </div>
            </div>
          </div>
        </div>
      </> : (
        <div className="mt-4">Chưa có giảng viên.</div>
      )}
    </AdminLayout>
  )
}
