import React from 'react'
import { ViewMode, Gantt } from "gantt-task-react"
import { useNavigate } from 'react-router-dom'

export default function Progress({ data }) {
    const navigate = useNavigate()

    return (
        <Gantt
            tasks={data}
            onClick={(item) => navigate('/detail-task', { state: item.task })}
            viewMode={ViewMode.Week}
            listCellWidth=""
            columnWidth={100}
            rowHeight={50}
            barBackgroundColor="#1c57a5"
            barProgressColor="#198754"
            fontSize={16}
        />
    )
}
