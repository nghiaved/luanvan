import React, { useCallback, useEffect, useState } from "react"
import AdminLayout from '../components/AdminLayout'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from "axios"

export default function AdminStudents() {
  const [students, setStudents] = useState([])
  const [studentId, setStudentId] = useState(null)

  const fetchStudents = useCallback(async () => {
    await axios.get('http://localhost:8000/api/users/get-all-students')
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

  const handleDeleteStudent = async () => {
    toast.success(studentId)
  }

  return (
    <AdminLayout>
      <div className='display-6'>Trang quản lý sinh viên</div>
      {students.length > 0 ? <>
        <table className="table table-hover mt-4">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên sinh viên</th>
              <th scope="col">Quản lý</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {students.map((student, index) => (
              <tr key={student._id}>
                <th scope="row">{++index}</th>
                <td>{student.fullname}</td>
                <td>
                  <Link data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setStudentId(student._id)}>Xoá</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Xoá sinh viên</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                Bạn có chắc chắn muốn xoá sinh viên này?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Trở lại</button>
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDeleteStudent}>Xoá</button>
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
