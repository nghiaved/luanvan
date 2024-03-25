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
        <div className="row mt-4">
          {registers.map(register => (
            <div key={register._id} className='col-lg-6 mb-4'>
              <div className="card h-100">
                <div className="card-header">
                  <h6 className="text-nowrap overflow-hidden mb-0">{register.topic.title}</h6>
                </div>
                <div className="card-body">
                  <b>Sinh viên thực hiện</b>
                  <h6>{register.student.fullname} {register.student.username.toUpperCase()}</h6>
                  <hr />
                  <b>Giảng viên hướng dẫn</b>
                  <h6>{register.lecturer.fullname} {register.lecturer.username}</h6>
                  <hr />
                  <div className="text-end">
                    {register.final === true
                      ? <span className="text-success">Đã hoàn thành</span>
                      : register.final === false
                        ? <span className="text-danger">Không hoàn thành</span>
                        : <span className="text-warning">Đang thực hiện</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </> : (
        <div className="mt-4">Chưa có đồ án.</div>
      )
      }
    </AdminLayout >
  )
}
