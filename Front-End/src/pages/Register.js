import React from 'react'
import AuthLayout from '../components/AuthLayout'
import FormRegister from '../components/FormRegister'

export default function Register() {
    return (
        <AuthLayout
            name='Đăng ký'
            component={<FormRegister />}
        />
    )
}
