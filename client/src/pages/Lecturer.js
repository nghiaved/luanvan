import React from "react"
import Layout from "../components/Layout"
import ListTopics from "../components/ListTopics"
import ListRegisters from "../components/ListRegisters"

export default function Lecturer() {
    return (
        <Layout>
            <ul className="nav nav-tabs nav-tabs-bordered">
                <li className="nav-item mt-2">
                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#list-topics">Danh mục đề tài</button>
                </li>
                <li className="nav-item mt-2">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#list-registers">Danh mục đăng ký</button>
                </li>
            </ul>
            <div className="tab-content pt-4">
                <div className="tab-pane fade show active" id="list-topics">
                    <ListTopics />
                </div>
                <div className="tab-pane fade show" id="list-registers">
                    <ListRegisters />
                </div>
            </div>
        </Layout>
    )
}
