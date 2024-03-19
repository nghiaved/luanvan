import React, { useCallback, useEffect, useState } from "react"
import AdminLayout from '../components/AdminLayout'
import axios from "axios"

export default function AdminProjects() {
  const [registers, setRegisters] = useState([])

  const fetchRegisters = useCallback(async () => {
    await axios.get('http://localhost:8000/api/admin/get-all-registers')
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
                  {register.final === true
                    ? <span className="text-success">Đã hoàn thành</span>
                    : <span className="text-warning">Đang thực hiện</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </> : (
        <div className="mt-4">Chưa có đồ án.</div>
      )}
    </AdminLayout>
  )
}
