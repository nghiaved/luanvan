import React, { useCallback, useEffect, useState } from "react"
import AdminLayout from '../components/AdminLayout'
import { toast } from 'react-toastify'
import axios from "axios"

export default function AdminLecturers() {
  const [lecturers, setLecturers] = useState([])
  const [lecturer, setLecturer] = useState(null)

  const fetchLecturers = useCallback(async () => {
    await axios.get('http://localhost:8000/api/users/get-all-lecturers')
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
    await axios.patch(`http://localhost:8000/api/users/accept-user/${lecturer._id}`)
      .then(res => {
        if (res.data.status === true) {
          toast.success(res.data.message)
          fetchLecturers()
        }
      })
      .catch(err => console.log(err))
  }

  const handleRefuseLecturer = async () => {
    await axios.delete(`http://localhost:8000/api/users/refuse-user/${lecturer._id}`)
      .then(res => {
        if (res.data.status === true) {
          toast.success(res.data.message)
          fetchLecturers()
        }
      })
      .catch(err => console.log(err))
  }

  return (
    <AdminLayout>
      <div className='display-6'>Trang quản lý giảng viên</div>
      {lecturers.length > 0 ? <>
        <table className="table table-hover mt-4">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên giảng viên</th>
              <th scope="col">Mã số CB</th>
              <th scope="col">Thông tin</th>
              <th scope="col">Quản lý</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {lecturers.map((lecturer, index) => (
              <tr key={lecturer._id}>
                <th scope="row">{++index}</th>
                <td>{lecturer.fullname}</td>
                <td>{lecturer.username}</td>
                <td>
                  <button className="btn text-info"
                    data-bs-toggle="modal" data-bs-target="#infoModal"
                    onClick={() => setLecturer(lecturer)}>
                    Chi tiết
                  </button>
                </td>
                <td>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
