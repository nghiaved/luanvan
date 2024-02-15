import React, { useCallback, useEffect, useState } from "react"
import AdminLayout from '../components/AdminLayout'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from "axios"

export default function AdminProjects() {
  const [registers, setRegisters] = useState([])
  const [registerId, setRegisterId] = useState(null)

  const fetchRegisters = useCallback(async () => {
    await axios.get('http://localhost:8000/api/registers/get-all-registers')
      .then(res => {
        if (res.data.status === true) {
          setRegisters(res.data.registers)
        }
      })
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    fetchRegisters()
  }, [fetchRegisters])

  const handleDeleteRegister = async () => {
    toast.success(registerId)
  }

  return (
    <AdminLayout>
      <div className='display-6'>Trang quản lý đồ án</div>
      {registers.length > 0 ? <>
        <table className="table table-hover mt-4">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên đề tài</th>
              <th scope="col">Tên sinh viên</th>
              <th scope="col">Tên giảng viên</th>
              <th scope="col">Quản lý</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {registers.map((register, index) => (
              <tr key={register._id}>
                <th scope="row">{++index}</th>
                <td>{register.topic.title}</td>
                <td>{register.student.fullname}</td>
                <td>{register.lecturer.fullname}</td>
                <td>
                  <Link data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setRegisterId(register._id)}>Xoá</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Xoá đồ án</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                Bạn có chắc chắn muốn xoá đồ án này?
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Trở lại</button>
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDeleteRegister}>Xoá</button>
              </div>
            </div>
          </div>
        </div>
      </> : (
        <div className="mt-4">Chưa có đồ án.</div>
      )}
    </AdminLayout>
  )
}
