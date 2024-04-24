import React from 'react'
import ButtonModal from './ButtonModal'
import ModalConfirm from './ModalConfirm'

export default function ButtonModalConfirm({ id, action, type, title, content, func }) {
    return (
        <>
            <ButtonModal id={id} action={action} type={type} />
            <ModalConfirm
                id={id}
                action={action}
                type={type}
                title={title}
                content={content}
                func={func}
            />
        </>
    )
}
