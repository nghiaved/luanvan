import React, { useCallback, useEffect, useState } from "react"
import AdminLayout from '../components/AdminLayout'
import ModalConfirm from '../components/ModalConfirm'
import ProfileInfo from "../components/ProfileInfo"
import { toast } from 'react-toastify'
import axios from "axios"
import Avatar from "../components/Avatar"

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
                  <Avatar src={student.avatar} alt={student.fullname} />
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
        <div className="modal fade" id="infoModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body">
                {student && <ProfileInfo user={student} />}
              </div>
            </div>
          </div>
        </div>
        <ModalConfirm
          id='refuseModal'
          action='Xoá'
          type='danger'
          title='Xoá sinh viên'
          content='Bạn có chắc chắn muốn xoá sinh viên này?'
          func={handleRefuseStudent}
        />
      </> : (
        <div className="mt-4">Chưa có sinh viên.</div>
      )}
    </AdminLayout>
  )
}
