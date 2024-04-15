import React from 'react'
import AuthLayout from '../components/AuthLayout'
import FormLogin from '../components/FormLogin'

export default function Login() {
    return (
        <AuthLayout
            name='Đăng nhập'
            component={<FormLogin />}
        />
    )
}
