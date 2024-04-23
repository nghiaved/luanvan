import React from 'react'

export default function ButtonModalConfirm({ id, action, type, title, children, func }) {
    return (
        <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
                <form onSubmit={func} className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button name='close' type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">{children}</div>
                    <div className="modal-footer">
                        <button type="reset" className="btn btn-secondary" data-bs-dismiss="modal">Trở lại</button>
                        <button type="submit" className={`btn btn-${type}`}>{action}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
