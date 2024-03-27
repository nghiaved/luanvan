import axios from 'axios'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { socket } from '../utils/socket'

export default function Login() {
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
        <div className='layout-wrapper'>
            <header>
                <Link to='/'>Trang chủ</Link>
                <Link to='/register'>Đăng ký</Link>
            </header>
            <main>
                <div className='text-center display-6 mb-4'>Đăng nhập</div>
                <div className='login-wrapper'>
                    <div className='d-flex flex-column align-items-start'>
                        <img src='https://insacmau.com/wp-content/uploads/2023/02/logo-dai-hoc-Can-Tho.png' alt='' />
                        <div className='ms-4'>
                            <hr />
                            <b>Sinh viên thực hiện</b>
                            <h6>Nguyễn Thành Nghĩa B2004736</h6>
                            <hr />
                            <b>Giảng viên hướng dẫn</b>
                            <h6>Lâm Chí Nguyện 001708</h6>
                            <hr />
                            <p>Ngày báo cáo: 01-01-2024</p>
                        </div>
                    </div>
                    <form className='form-login m-0' onSubmit={handleLogin}>
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
                        <button className='btn btn-primary w-100' type='submit'>Đăng nhập</button>
                    </form>
                </div>
            </main>
        </div>
    )
}
