import React from 'react'
import AuthLayout from '../components/layouts/AuthLayout'
import FormLogin from '../components/auth/FormLogin'

export default function Login() {
    return (
        <AuthLayout
            name='Đăng nhập'
            component={<FormLogin />}
        />
    )
}
