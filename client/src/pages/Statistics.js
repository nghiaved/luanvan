import React, { useEffect, useState } from "react";
import { ViewMode, Gantt } from "gantt-task-react";
import Layout from '../components/Layout'
import "gantt-task-react/dist/index.css";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'

export default function Statistics() {
    const location = useLocation()
    const { tasks, student } = location.state
    const [data, setData] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (tasks) {
            let totalCompleted = 0
            const initTasks = tasks.map(task => {
                task.start = new Date(task.start)
                task.end = new Date(task.end)

                if (task.status === true) ++totalCompleted

                return {
                    start: new Date(task.start),
                    end: new Date(task.end),
                    name: task.title,
                    progress: task.points || 0,
                    id: task._id
                }
            })

            setData({ tasks: initTasks, totalCompleted, totalCount: initTasks.length })
        }
    }, [tasks])

    const handleTerminate = async () => {
        toast.success('Terminated')
    }

    return (
        <Layout>
            <div className='display-6 mb-4'>Thống kê công việc "{student.fullname}"</div>
            {data ? <>
                <Gantt
                    tasks={data.tasks}
                    viewMode={ViewMode.Week}
                    listCellWidth=""
                    columnWidth={100}
                    rowHeight={50}
                    barBackgroundColor="#1c57a5"
                    barProgressColor="#198754"
                    fontSize={16}
                />
                <div className='mb-4'>
                    <b className='me-2'>Tổng số công việc hoàn thành:</b>
                    <i>{data.totalCompleted}/{data.totalCount}</i>
                </div>
                <button className='btn btn-danger me-2' onClick={handleTerminate}>Kết thúc</button>
            </> : (
                <div className='mb-4'>Sinh viên chưa có công việc nào.</div>
            )}
            <button className='btn btn-secondary' onClick={() => navigate(-1)}>Trở lại</button>
        </Layout>
    )
}
