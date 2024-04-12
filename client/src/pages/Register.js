import axios from 'axios'
import React from 'react'
import { toast } from 'react-toastify'
import AuthLayout from '../components/AuthLayout'

export default function Register() {
    const handleRegister = async (e) => {
        e.preventDefault()
        await axios.post('http://localhost:8000/api/users/register', {
            fullname: e.target.fullname.value,
            username: e.target.username.value.toLowerCase(),
            password: e.target.password.value,
            role: e.target.role.value
        })
            .then(res => {
                res.data.status === true
                    ? toast.success(res.data.message)
                    : toast.error(res.data.message)
            })
            .catch(err => console.log(err))
    }

    return (
        <AuthLayout action={{ name: 'Đăng nhập', path: '/login' }}>
            <div className='text-center display-6 mb-4'>Đăng ký</div>
            <form className='form-login' onSubmit={handleRegister}>
                <div className="form-group mb-4">
                    <input name='fullname' required autoComplete="off" type="text" className="form-control" placeholder="Họ và tên" />
                </div>
                <div className="form-group mb-4">
                    <input name='username' required autoComplete="off" type="text" className="form-control" placeholder="Tên đăng nhập" />
                </div>
                <div className="form-group mb-4">
                    <input name='password' required autoComplete="off" maxLength={30} minLength={6}
                        type="password" className="form-control" placeholder="Mật khẩu" />
                </div>
                <div className='d-flex mb-4'>
                    <div className="form-check me-4">
                        <input defaultChecked value={2} className="form-check-input" type="radio" name="role" id="student" />
                        <label className="form-check-label" htmlFor="student">
                            Sinh viên
                        </label>
                    </div>
                    <div className="form-check">
                        <input value={1} className="form-check-input" type="radio" name="role" id="lecturer" />
                        <label className="form-check-label" htmlFor="lecturer">
                            Giảng viên
                        </label>
                    </div>
                </div>
                <button className='btn btn-primary' type='submit'>Đăng ký</button>
            </form>
        </AuthLayout>
    )
}
