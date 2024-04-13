import React from 'react'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'
import axios from 'axios'

export default function ChangePassword() {
    const handleChangePassword = async (e) => {
        e.preventDefault()

        const { currentPassword, newPassword, renewPassword } = e.target

        if (newPassword.value !== renewPassword.value) {
            return toast.error('Re-enter incorrect password')
        }

        const token = sessionStorage.getItem('token')

        await axios.patch(`http://localhost:8000/api/users/change-password/${jwtDecode(token)._id}`, {
            password: currentPassword.value,
            newPassword: newPassword.value
        })
            .then(res => {
                if (res.data.status === true) {
                    toast.success(res.data.message)
                } else {
                    toast.error(res.data.message)
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <form onSubmit={handleChangePassword}>
            <div className="row mb-3">
                <label htmlFor="currentPassword" className="col-4 col-form-label">Mật khẩu hiện tại</label>
                <div className="col-6">
                    <input name='oldPassword' required maxLength={30} minLength={6} autoComplete='off'
                        type="password" className="form-control" id="currentPassword" />
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="newPassword" className="col-4 col-form-label">Mật khẩu mới</label>
                <div className="col-6">
                    <input name='newPassword' required maxLength={30} minLength={6} autoComplete='off'
                        type="password" className="form-control" id="newPassword" />
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="renewPassword" className="col-4 col-form-label">Nhập lại mật khẩu mới</label>
                <div className="col-6">
                    <input name='renewPassword' required maxLength={30} minLength={6} autoComplete='off'
                        type="password" className="form-control" id="renewPassword" />
                </div>
            </div>
            <div className="text-center">
                <button type="submit" className="btn btn-primary">Đổi mật khẩu</button>
            </div>
        </form>
    )
}
