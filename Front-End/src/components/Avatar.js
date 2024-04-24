import React from 'react'

export default function Avatar({ src, alt }) {
    return (
        <img
            className='img-avatar mb-2'
            src={src ? src : "/no-avatar.png"}
            alt={alt}
        />
    )
}
