import axios from 'axios'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function Login() {
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        await axios.post('http://localhost:8000/api/users/login', {
            username: e.target.username.value.toLowerCase(),
            password: e.target.password.value
        })
            .then(res => {
                if (res.data.status === true) {
                    sessionStorage.setItem('token', res.data.token)
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
                <form className='form-login' onSubmit={handleLogin}>
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
            </main>
        </div>
    )
}
