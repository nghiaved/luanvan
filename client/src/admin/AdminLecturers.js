import React, { useCallback, useEffect, useState } from "react"
import AdminLayout from '../components/AdminLayout'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from "axios"

export default function AdminLecturers() {
  const [lecturers, setLecturers] = useState([])
  const [lecturerId, setLecturerId] = useState(null)

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

  const handleDeleteLecturer = async () => {
    toast.success(lecturerId)
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
              <th scope="col">Quản lý</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {lecturers.map((lecturer, index) => (
              <tr key={lecturer._id}>
                <th scope="row">{++index}</th>
                <td>{lecturer.fullname}</td>
                <td>
                  <Link data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setLecturerId(lecturer._id)}>Xoá</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Xoá giảng viên</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                Bạn có chắc chắn muốn xoá giảng viên này?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Trở lại</button>
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDeleteLecturer}>Xoá</button>
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
