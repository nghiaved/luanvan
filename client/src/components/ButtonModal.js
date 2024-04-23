import React from 'react'

export default function ButtonModal({ id, type, action }) {
    return (
        <button
            className={`btn btn-${type} me-2`}
            data-bs-toggle="modal"
            data-bs-target={`#${id}`}>
            {action}
        </button>
    )
}
