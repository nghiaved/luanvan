import React, { useEffect, useRef } from 'react'

export default function BackToTop() {
    const backToTopBtn = useRef()

    useEffect(() => {
        if (backToTopBtn?.current) {
            const toggleBackToTop = () => {
                if (backToTopBtn.current) {
                    if (window.scrollY > 100) {
                        backToTopBtn.current.classList.add('active')
                    } else {
                        backToTopBtn.current.classList.remove('active')
                    }
                }
            }
            window.addEventListener('load', toggleBackToTop)
            document.addEventListener('scroll', toggleBackToTop)
        }
    }, [])

    return (
        <a ref={backToTopBtn} href="#top" className="back-to-top">
            <i className="bi bi-arrow-up-short"></i>
        </a>
    )
}
