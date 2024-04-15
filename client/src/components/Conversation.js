import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useGlobal } from '../utils/useGlobal'
import { socket } from '../utils/socket'

export default function Conversation() {
    const token = sessionStorage.getItem('token')
    const [state, dispatch] = useGlobal()
    const [hide, setHide] = useState(false)
    const [user, setUser] = useState({})
    const [messages, setMessages] = useState([])
    const messageRef = useRef()

    useEffect(() => {
        if (state.userConversation) {
            setUser(state.userConversation)
        }

        socket.on('user-online', async username => {
            if (username !== jwtDecode(token).username && state.userConversation?.username === username) {
                const res = await axios.get(`http://localhost:8000/api/users/get-user/${username}`)
                setUser(res.data.user)
                await dispatch({ fetchAgain: !state.fetchAgain })
            }
        })

        socket.on('user-offline', async username => {
            if (username !== jwtDecode(token).username && state.userConversation?.username === username) {
                const res = await axios.get(`http://localhost:8000/api/users/get-user/${username}`)
                setUser(res.data.user)
                await dispatch({ fetchAgain: !state.fetchAgain })
            }
        })
    }, [state.userConversation, token, state.fetchAgain, dispatch])

    const handleSendMessage = async (e) => {
        e.preventDefault()
        setMessages([...messages, {
            content: e.target.mess.value,
            sender: jwtDecode(token)._id
        }])
        await dispatch({ fetchAgain: !state.fetchAgain })
        e.target.mess.value = ''
    }

    const handleClose = () => {
        setHide(false)
        dispatch({ userConversation: null })
    }

    const checkConversation = state.userConversation
        ? hide
            ? { right: 70, height: 50, overflow: 'hidden' }
            : { right: 70 }
        : {}

    return (
        <div className="conversation-wrapper" style={checkConversation}>
            <div className={`conversation-header bg-${user.isOnline ? 'success' : 'secondary'} text-white`}>
                <span className='d-flex align-items-center'>
                    <img src={user.avatar ? user.avatar : "/no-avatar.png"} alt="Profile" className="rounded-circle" />
                    <div>
                        <span>{user.fullname}</span>
                        <div style={{ fontSize: 12 }}>{user.isOnline ? 'Đang hoạt động' : 'Không hoạt động'}</div>
                    </div>
                </span>
                <span>
                    <i onClick={() => setHide(!hide)} className={hide ? "bi bi-plus-lg me-3" : "bi bi-dash-lg me-3"}></i>
                    <i onClick={handleClose} className="bi bi-x-lg nav-icon"></i>
                </span>
            </div>
            <div className={hide ? 'conversation-body d-none' : 'conversation-body'}>
                {messages.map((item, index) => {
                    messageRef.current?.scrollIntoView({ behavior: 'smooth' })
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
        </div>
    )
}
