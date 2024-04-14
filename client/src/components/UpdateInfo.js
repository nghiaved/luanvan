import React, { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { toast } from 'react-toastify'
import FileBase64 from 'react-file-base64'
import axios from 'axios'
import Avatar from './Avatar'

export default function UpdateInfo() {
    const token = sessionStorage.getItem('token')
    const [user, setUser] = useState({})
    const [image, setImage] = useState()

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`http://localhost:8000/api/users/get-user/${jwtDecode(token).username}`)
            setUser(res.data.user)
        }
        fetchUser()
    }, [token])

    const handleUpdateInfo = async (e) => {
        e.preventDefault()

        const { birth, sex, grade, major, course, faculty, email, phone } = e.target
        const data = {
            birth: birth?.value,
            sex: sex?.value,
            grade: grade?.value,
            major: major?.value,
            course: course?.value,
            faculty: faculty?.value,
            email: email?.value,
            phone: phone?.value
        }

        if (image) {
            data.avatar = image
        }

        await axios.put(`http://localhost:8000/api/users/update-info/${jwtDecode(token)._id}`, data)
            .then(res => {
                if (res.data.status === true) {
                    toast.success(res.data.message)
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <form onSubmit={handleUpdateInfo}>
            <div className="row mb-3">
                <label htmlFor="profileImage" className="col-md-4 col-lg-3 col-form-label">Ảnh đại diện</label>
                <div className="col-8 d-flex align-items-center">
                    <Avatar src={image ? image : user.avatar} alt={user.fullname} />
                    <div className="ms-4 d-flex flex-column">
                        <label className='set-upload-img mb-2'>
                            <FileBase64
                                multiple={false}
                                onDone={({ base64 }) => {
                                    setImage(base64)
                                }}
                            />
                            <i className="btn btn-warning btn-sm bi bi-upload"></i>
                        </label>
                        <i onClick={() => setImage()} className="btn btn-danger btn-sm bi bi-trash"></i>
                    </div>
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="birth" className="col-3 col-form-label">Ngày sinh</label>
                <div className="col-8">
                    <input name='birth' maxLength={15} autoComplete='off'
                        type="text" className="form-control" id="birth" defaultValue={user.birth} />
                </div>
            </div>
            <div className="row mb-3">
                <label htmlFor="sex" className="col-3 col-form-label">Giới tính</label>
                <div className="col-8">
                    <input name='sex' maxLength={10} autoComplete='off'
                        type="text" className="form-control" id="sex" defaultValue={user.sex} />
                </div>
            </div>
            {user.role !== 1 && <>
                <div className="row mb-3">
                    <label htmlFor="grade" className="col-3 col-form-label">Lớp</label>
                    <div className="col-8">
                        <input name='grade' maxLength={20} autoComplete='off'
                            type="text" className="form-control" id="grade" defaultValue={user.grade} />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="major" className="col-3 col-form-label">Ngành học</label>
                    <div className="col-8">
                        <input name='major' maxLength={50} autoComplete='off'
                            type="text" className="form-control" id="major" defaultValue={user.major} />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="course" className="col-3 col-form-label">Khoá học</label>
                    <div className="col-8">
                        <input name='course' maxLength={5} autoComplete='off'
                            type="text" className="form-control" id="course" defaultValue={user.course} />
                    </div>
                </div>
            </>}
            <div className="row mb-3">
                <label htmlFor="faculty" className="col-3 col-form-label">Khoa</label>
                <div className="col-8">
                    <input name='faculty' maxLength={50} autoComplete='off'
                        type="text" className="form-control" id="faculty" defaultValue={user.faculty} />
                </div>
            </div>
            {user.role === 1 && <>
                <div className="row mb-3">
                    <label htmlFor="email" className="col-3 col-form-label">Email</label>
                    <div className="col-8">
                        <input name='email' maxLength={30} autoComplete='off'
                            type="text" className="form-control" id="email" defaultValue={user.email} />
                    </div>
                </div>
                <div className="row mb-3">
                    <label htmlFor="phone" className="col-3 col-form-label">Số điện thoại</label>
                    <div className="col-8">
                        <input name='phone' maxLength={15} autoComplete='off'
                            type="text" className="form-control" id="phone" defaultValue={user.phone} />
                    </div>
                </div>
            </>}
            <div className="text-center">
                <button type="submit" className="btn btn-primary">Lưu thông tin</button>
            </div>
        </form>
    )
}
