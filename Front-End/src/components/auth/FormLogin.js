import axios from 'axios'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { socket } from '../../utils/socket'

export default function FormLogin() {
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        const username = e.target.username.value.toLowerCase()
        await axios.post('http://localhost:8000/api/users/login', {
            username, password: e.target.password.value
        })
            .then(res => {
                if (res.data.status === true) {
                    sessionStorage.setItem('token', res.data.token)
                    socket.emit('user-join', username)
                    navigate(0)
                } else {
                    toast.error(res.data.message)
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <div className='auth-wrapper'>
            <form className='form-auth m-0' onSubmit={handleLogin}>
                <div className="form-group mb-4">
                    <input name='username' required autoComplete="off" type="text" className="form-control" placeholder="Tên đăng nhập" />
                </div>
                <div className="form-group mb-4">
                    <input name='password' required autoComplete="off" type="password" className="form-control" placeholder="Mật khẩu" />
                </div>
                <div className="form-check mb-4">
                    <input type="checkbox" className="form-check-input" id="rememberLogin" />
                    <label className="form-check-label" htmlFor="rememberLogin">Ghi nhớ đăng nhập</label>
                </div>
                <div>
                    <button className='btn btn-primary w-50' type='submit'>Đăng nhập</button>
                    <Link to='/register' className='btn w-50'>Đăng ký</Link>
                </div>
            </form>
        </div>
    )
}
