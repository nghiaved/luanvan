import React, { useState, useRef, useEffect, useCallback } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useGlobal } from '../../utils/useGlobal'
import { socket } from '../../utils/socket'

export default function Conversation() {
    const token = sessionStorage.getItem('token')
    const [state, dispatch] = useGlobal()
    const [hide, setHide] = useState(false)
    const [messes, setMesses] = useState([])
    const messageRef = useRef()

    const getAllMesses = useCallback(async () => {
        const res = await axios.get(`http://localhost:8000/api/messes/get-messes/${state.registerId}`)
        if (res.data.status === true) {
            setMesses(res.data.messes)
        }
    }, [state.registerId])

    useEffect(() => {
        if (state.userConversation?._id && state.registerId) {
            getAllMesses()
        }
    }, [dispatch, getAllMesses, state])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        const res = await axios.post(`http://localhost:8000/api/messes/send-mess`, {
            register: state.registerId,
            sender: jwtDecode(token)._id,
            reader: state.userConversation._id,
            content: e.target.mess.value
        })
        if (res.data.status === true) {
            if (state.userConversation.isOnline) {
                socket.emit('send-notify', state.userConversation.username)
            }
            getAllMesses()
            e.target.mess.value = ''
        }
    }

    const handleClose = () => {
        setHide(false)
        dispatch({ userConversation: null, registerId: null })
    }

    const checkConversation = state.userConversation
        ? hide
            ? { right: 70, height: 50, overflow: 'hidden' }
            : { right: 70 }
        : {}

    return (
        <div className="conversation-wrapper" style={checkConversation}>
            {state.userConversation && <>
                <div className={`conversation-header bg-${state.userConversation.isOnline ? 'success' : 'secondary'} text-white`}>
                    <span className='d-flex align-items-center'>
                        <img src={state.userConversation.avatar ? state.userConversation.avatar : "/no-avatar.png"} alt="Profile" className="rounded-circle" />
                        <div>
                            <span>{state.userConversation.fullname}</span>
                            <div style={{ fontSize: 12 }}>{state.userConversation.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}</div>
                        </div>
                    </span>
                    <span>
                        <i onClick={() => setHide(!hide)} className={hide ? "bi bi-plus-lg me-3" : "bi bi-dash-lg me-3"}></i>
                        <i onClick={handleClose} className="bi bi-x-lg nav-icon"></i>
                    </span>
                </div>
                <div className={hide ? 'conversation-body d-none' : 'conversation-body'}>
                    {messes.map((item, index) => {
                        if (index === messes.length - 1) {
                            messageRef.current?.scrollIntoView({ behavior: 'smooth' })
                        }
                        return <div key={index} style={{ fontSize: 15 }} className={item.sender === jwtDecode(token)._id ? 'text-end ms-5' : 'me-5'}>
                            {item.content}
                        </div>
                    })}
                    <div className='pt-4' ref={messageRef}></div>
                </div>
                <form onSubmit={handleSendMessage} className={hide ? "conversation-footer input-group d-none" : "conversation-footer input-group"}>
                    <input name='mess' required autoComplete='off' type="text" className="form-control" placeholder='Tin nhắn...' />
                    <button className="input-group-text">
                        <i className="bi bi-send"></i>
                    </button>
                </form>
            </>}
        </div>
    )
}
