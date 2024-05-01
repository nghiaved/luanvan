import React from 'react'
import ButtonModal from './ButtonModal'
import ModalForm from './ModalForm'

export default function ButtonModalForm({ id, action, type, title, children, func }) {
    return (
        <>
            <ButtonModal id={id} action={action} type={type} />
            <ModalForm id={id} action={action} type={type} title={title} func={func}>{children}</ModalForm>
        </>
    )
}
