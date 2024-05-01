import React from "react"
import AdminLayout from '../components/layouts/AdminLayout'
import AdminTopics from '../components/admin/AdminTopics'
import AdminRegisters from '../components/admin/AdminRegisters'

export default function Topics() {
  return (
    <AdminLayout breadcrumb='Đề tài'>
      <ul className="nav nav-tabs nav-tabs-bordered">
        <li className="nav-item mt-2">
          <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#topics">Danh mục đề tài</button>
        </li>
        <li className="nav-item mt-2">
          <button className="nav-link" data-bs-toggle="tab" data-bs-target="#registers">Danh mục đăng ký</button>
        </li>
      </ul>
      <div className="tab-content pt-4">
        <div className="tab-pane fade show active" id="topics">
          <AdminTopics />
        </div>
        <div className="tab-pane fade" id="registers">
          <AdminRegisters />
        </div>
      </div>
    </AdminLayout>
  )
}
