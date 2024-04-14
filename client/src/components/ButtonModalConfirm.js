import React from 'react'
import ModalConfirm from './ModalConfirm'

export default function ButtonModalConfirm({ id, action, type, title, content, func }) {
    return (
        <>
            <button
                className={`btn btn-${type} me-2`}
                data-bs-toggle="modal"
                data-bs-target={`#${id}`}>
                {action}
            </button>
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
