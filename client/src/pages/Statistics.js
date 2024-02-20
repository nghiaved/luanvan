import React, { useEffect, useState } from "react";
import { ViewMode, Gantt } from "gantt-task-react";
import axios from 'axios'
import Layout from '../components/Layout'
import "gantt-task-react/dist/index.css";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'
import { socket } from '../utils/socket'

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

    const handleFinal = async (final) => {
        const res = await axios.patch(`http://localhost:8000/api/registers/final-topic/${student._id}`, { final })
        if (res.data.status === true) {
            socket.emit('send-notify', student.username)
            toast.success(res.data.message)
        }
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
                <button className='btn btn-primary me-2' data-bs-toggle="modal" data-bs-target="#finishModal">Hoàn thành</button>
                <div className="modal fade" id="finishModal" tabIndex="-1" aria-labelledby="finishModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="terminateModalLabel">Hoàn thành đề tài</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Bạn có chắc chắn muốn hoàn thành đề tài này?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Trở lại</button>
                                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={() => handleFinal(true)}>Hoàn thành</button>
                            </div>
                        </div>
                    </div>
                </div>
                <button className='btn btn-danger me-2' data-bs-toggle="modal" data-bs-target="#terminateModal">Kết thúc</button>
                <div className="modal fade" id="terminateModal" tabIndex="-1" aria-labelledby="terminateModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="terminateModalLabel">Kết thúc đề tài</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                Bạn có chắc chắn muốn kết thúc đề tài này?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Trở lại</button>
                                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={() => handleFinal(false)}>Kết thúc</button>
                            </div>
                        </div>
                    </div>
                </div>
            </> : (
                <div className='mb-4'>Sinh viên chưa có công việc nào.</div>
            )}
            <button className='btn btn-secondary' onClick={() => navigate(-1)}>Trở lại</button>
        </Layout>
    )
}
