import React, { useState } from 'react'
import { ViewMode, Gantt } from "gantt-task-react"
import DetailTask from './DetailTask'

export default function Progress({ data, isAdmin = false }) {
    const [task, setTask] = useState(data[0].task)

    return (
        <>
            <Gantt
                tasks={data}
                onClick={item => setTask(item.task)}
                viewMode={ViewMode.Week}
                listCellWidth=""
                columnWidth={100}
                rowHeight={50}
                barBackgroundColor="#1c57a5"
                barProgressColor="#198754"
                fontSize={16}
            />
            <DetailTask data={task} isAdmin={isAdmin} />
        </>
    )
}
