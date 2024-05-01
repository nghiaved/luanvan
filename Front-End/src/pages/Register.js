import React from 'react'
import AuthLayout from '../components/layouts/AuthLayout'
import FormRegister from '../components/auth/FormRegister'

export default function Register() {
    return (
        <AuthLayout
            name='Đăng ký'
            component={<FormRegister />}
        />
    )
}
