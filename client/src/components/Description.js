import React from 'react'
import ReactQuill from 'react-quill'

export default function Description({ desc }) {
    return (
        <div className="accordion mb-2">
            <div className="accordion-item">
                <h2 className="accordion-header" id="descriptionHeading">
                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#descriptionTask" aria-expanded="true" aria-controls="descriptionTask">
                        Mô tả
                    </button>
                </h2>
                <div id="descriptionTask" className="accordion-collapse collapse show" aria-labelledby="descriptionHeading" data-bs-parent="#accordionExample">
                    <div className="accordion-body">
                        <ReactQuill value={desc} readOnly theme="bubble" />
                    </div>
                </div>
            </div>
        </div>
    )
}
