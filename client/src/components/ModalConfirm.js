import React from 'react'

export default function ButtonModalConfirm({ id, action, type, title, content, func }) {
    return (
        <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">{content}</div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Trở lại</button>
                        <button type="button" className={`btn btn-${type}`} data-bs-dismiss="modal" onClick={func}>{action}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
