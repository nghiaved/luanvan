import React, { useCallback, useEffect, useState } from "react"
import AdminLayout from '../components/AdminLayout'
import axios from "axios"
import Avatar from "../components/Avatar"

export default function AdminProjects() {
  const [registers, setRegisters] = useState([])
  const [filter, setFilter] = useState('')

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

  const handleFilter = item => {
    if (filter === '1') return item.final === true
    if (filter === '2') return item.final === false
    if (filter === '3') return item.final === undefined
    return filter.toLowerCase() === '' ? item
      : item.topic.title.toLowerCase().includes(filter.toLowerCase())
      || item.lecturer.username.toLowerCase().includes(filter.toLowerCase())
      || item.lecturer.fullname.toLowerCase().includes(filter.toLowerCase())
      || item.student.username.toLowerCase().includes(filter.toLowerCase())
      || item.student.fullname.toLowerCase().includes(filter.toLowerCase())
  }

  return (
    <AdminLayout>
      <div className="d-flex justify-content-between align-items-center">
        <h3>Trang quản lý đồ án</h3>
        <div className="flex-fill d-flex justify-content-end gap-4">
          <select onChange={(e) => setFilter(e.target.value)} className="form-select home-filter">
            <option defaultChecked value=''>Tất cả</option>
            <option value='1'>Đã hoàn thành</option>
            <option value='2'>Không hoàn thành</option>
            <option value='3'>Đang thực hiện</option>
          </select>
          <input onChange={e => setFilter(e.target.value)} className="form-control home-filter" placeholder="Tìm kiếm..." />
        </div>
      </div>
      {registers.length > 0 ? <>
        <div className="row mt-4">
          {registers.filter(item => handleFilter(item)).map(register => (
            <div key={register._id} className='col-lg-6 mb-4'>
              <div className="card h-100">
                <div className="card-header">
                  <h6 className="text-nowrap overflow-hidden mb-0">{register.topic.title}</h6>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <b>Giảng viên hướng dẫn</b>
                      <h6>{register.lecturer.fullname} {register.lecturer.username}</h6>
                    </div>
                    <Avatar src={register.lecturer.avatar} alt={register.lecturer.fullname} />
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <Avatar src={register.student.avatar} alt={register.student.fullname} />
                    <div>
                      <b>Sinh viên thực hiện</b>
                      <h6>{register.student.fullname} {register.student.username.toUpperCase()}</h6>
                    </div>
                  </div>
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
      )}
    </AdminLayout >
  )
}
