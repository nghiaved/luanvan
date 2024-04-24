import React from 'react'

export default function Status({ check }) {
    return (
        check
            ? <span className="text-success"><i className="bi bi-check-square"></i></span>
            : <span className="text-warning"><i className="bi bi-hourglass-split"></i></span>
    )
}
