import React, { useCallback, useEffect, useState } from 'react'
import axios from "axios"
import { toast } from 'react-toastify'
import { socket } from '../utils/socket'
import ButtonModalForm from "./ButtonModalForm"

export default function FinalTopic({ student }) {
    const [final, setFinal] = useState({})

    const fetchRegister = useCallback(async () => {
        if (student._id) {
            const res = await axios.get('http://localhost:8000/api/registers/get-register-by-student/' + student._id)
            setFinal(res.data.register.final)
        }
    }, [student._id])

    useEffect(() => {
        fetchRegister()
    }, [fetchRegister])

    const handleFinal = async (final, e) => {
        e.preventDefault()
        const res = await axios.patch(`http://localhost:8000/api/registers/final-topic/${student._id}`, {
            desc: e.target.desc.value,
            final
        })
        if (res.data.status === true) {
            fetchRegister()
            socket.emit('send-notify', student.username)
            e.target.close.click()
            toast.success(res.data.message)
        }
    }

    return (
        final !== undefined
            ? final === true
                ? <button className="btn btn-success pe-none">Đã hoàn thành</button>
                : <button className="btn btn-danger pe-none">Không hoàn thành</button>
            : <>
                <ButtonModalForm
                    id='finishModal'
                    action='Hoàn thành'
                    type='primary'
                    title='Hoàn thành đề tài'
                    func={e => handleFinal(true, e)}
                >
                    <label htmlFor="colFormLabel" className="col col-form-label">Nhập nội dung: </label>
                    <textarea required name='desc' type="text" className="form-control" id="colFormLabel" />
                </ButtonModalForm>
                <ButtonModalForm
                    id='terminateModal'
                    action='Kết thúc'
                    type='danger'
                    title='Kết thúc đề tài'
                    func={e => handleFinal(false, e)}
                >
                    <label htmlFor="colFormLabel" className="col col-form-label">Nhập lý do kết thúc: </label>
                    <textarea required name='desc' type="text" className="form-control" id="colFormLabel" />
                </ButtonModalForm>
            </>
    )
}
