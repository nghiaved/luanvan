import React, { useState } from 'react'
import { ViewMode, Gantt } from "gantt-task-react"
import DetailTask from './DetailTask'

export default function Progress({ data, isAdmin = false }) {
    const [task, setTask] = useState(data[0].task)
    const [viewMode, setViewMode] = useState(ViewMode.Week)

    return (
        <>
            <div className='d-flex justify-content-end mb-2'>
                <div className='me-4 fw-bold'>Chế độ xem: </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="viewMode" id="Day" value={ViewMode.Day}
                        checked={viewMode === ViewMode.Day}
                        onChange={e => setViewMode(e.target.value)} />
                    <label className="form-check-label" htmlFor="Day">Ngày</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="viewMode" id="Week" value={ViewMode.Week}
                        checked={viewMode === ViewMode.Week}
                        onChange={e => setViewMode(e.target.value)} />
                    <label className="form-check-label" htmlFor="Week">Tuần</label>
                </div>
                <div className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="viewMode" id="Month" value={ViewMode.Month}
                        checked={viewMode === ViewMode.Month}
                        onChange={e => setViewMode(e.target.value)} />
                    <label className="form-check-label" htmlFor="Month">Tháng</label>
                </div>
            </div>
            <div className='mb-3'>
                <Gantt
                    tasks={data}
                    onClick={item => setTask(item.task)}
                    viewMode={viewMode}
                    listCellWidth=""
                    columnWidth={100}
                    rowHeight={50}
                    barBackgroundColor="#1c57a5"
                    barProgressColor="#198754"
                    fontSize={16}
                />
            </div>
            <DetailTask data={task} isAdmin={isAdmin} />
        </>
    )
}
