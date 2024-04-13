import React, { useCallback, useEffect, useState } from "react"
import AdminLayout from '../components/AdminLayout'
import { toast } from 'react-toastify'
import axios from "axios"

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [student, setStudent] = useState(null)
  const [filter, setFilter] = useState('')

  const fetchStudents = useCallback(async () => {
    await axios.get('http://localhost:8000/api/admin/get-all-students')
      .then(res => {
        if (res.data.status === true) {
          setStudents(res.data.students)
        }
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleAcceptStudent = async (student) => {
    await axios.patch(`http://localhost:8000/api/admin/accept-user/${student._id}`)
      .then(res => {
        if (res.data.status === true) {
          toast.success(res.data.message)
          fetchStudents()
        }
      })
      .catch(err => console.log(err))
  }

  const handleRefuseStudent = async () => {
    await axios.delete(`http://localhost:8000/api/admin/refuse-user/${student._id}`)
      .then(res => {
        if (res.data.status === true) {
          toast.success(res.data.message)
          fetchStudents()
        }
      })
      .catch(err => console.log(err))
  }

  const handleFilter = item => {
    if (filter === '1') return item.status === true
    if (filter === '2') return item.status === false
    if (filter === '3') return item.isRegistered === true
    if (filter === '4') return item.isRegistered === false && item.status === true
    return filter.toLowerCase() === '' ? item
      : item.username.toLowerCase().includes(filter.toLowerCase())
      || item.fullname.toLowerCase().includes(filter.toLowerCase())
  }

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center">
        <h3>Trang quản lý sinh viên</h3>
        <div className="flex-fill d-flex justify-content-end gap-4">
          <select onChange={(e) => setFilter(e.target.value)} className="form-select home-filter">
            <option defaultChecked value=''>Tất cả</option>
            <option value='1'>Đã xác nhận</option>
            <option value='2'>Chờ phản hồi</option>
            <option value='3'>Đã có đề tài</option>
            <option value='4'>Chưa có đề tài</option>
          </select>
          <input onChange={e => setFilter(e.target.value)} className="form-control home-filter" placeholder="Tìm kiếm..." />
        </div>
      </div>
      {students.length > 0 ? <>
        <div className="row mt-4">
          {students.filter(item => handleFilter(item)).map(student => (
            <div key={student._id} className='col-lg-4 mb-4'>
              <div className="card">
                <div className="card-header">
                  <div className='d-flex justify-content-between'>
                    <b>{student.fullname}</b>
                    <span>{student.username.toUpperCase()}</span>
                  </div>
                </div>
                <div className="card-body">
                  <img className='img-avatar mb-2' src={student.avatar ? student.avatar : "/no-avatar.png"} alt={student.fullname} />
                  <div className="my-3">
                    {student.isRegistered === true
                      ? <span className="text-success">Sinh viên đã đăng ký đề tài</span>
                      : <span className="text-warning">Sinh viên chưa đăng ký đề tài</span>
                    }
                  </div>
                  <div className='d-flex justify-content-between'>
                    <button className="btn text-info"
                      data-bs-toggle="modal" data-bs-target="#infoModal"
                      onClick={() => setStudent(student)}>
                      Chi tiết
                    </button>
                    <div>
                      {student.status === true
                        ? <span className="text-success">Đã xác nhận</span>
                        : <>
                          <button className='btn btn-primary me-2'
                            onClick={() => handleAcceptStudent(student)}>
                            Xác nhận
                          </button>
                          <button className='btn btn-danger'
                            data-bs-toggle="modal" data-bs-target="#refuseModal"
                            onClick={() => setStudent(student)}>
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
                  {student &&
                    <tbody className="table-group-divider">
                      <tr>
                        <th scope="row">Mã số SV</th>
                        <td>{student.username?.toUpperCase()}</td>
                      </tr>
                      <tr>
                        <th scope="row">Họ tên</th>
                        <td>{student.fullname}</td>
                      </tr>
                      <tr>
                        <th scope="row">Ngày sinh</th>
                        <td>{student.birth}</td>
                      </tr>
                      <tr>
                        <th scope="row">Giới tính</th>
                        <td>{student.sex}</td>
                      </tr>
                      <tr>
                        <th scope="row">Lớp</th>
                        <td>{student.grade}</td>
                      </tr>
                      <tr>
                        <th scope="row">Ngành học</th>
                        <td>{student.major}</td>
                      </tr>
                      <tr>
                        <th scope="row">Khoá học</th>
                        <td>{student.course}</td>
                      </tr>
                      <tr>
                        <th scope="row">Khoa</th>
                        <td>{student.faculty}</td>
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
                <h5 className="modal-title" id="refuseModalLabel">Xoá sinh viên</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                Bạn có chắc chắn muốn xoá sinh viên này?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Trở lại</button>
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleRefuseStudent}>Xoá</button>
              </div>
            </div>
          </div>
        </div>
      </> : (
        <div className="mt-4">Chưa có sinh viên.</div>
      )}
    </AdminLayout>
  )
}
