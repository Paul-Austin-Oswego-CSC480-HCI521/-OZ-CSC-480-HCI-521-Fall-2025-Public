import React from "react";

export default function ImageModal({ src, alt = "Kudos", onClose }) {
    if (!src) return null;

    const stop = (e) => e.stopPropagation();

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div className="modal-content" onClick={stop}>
                <button
                    className="close-btn"
                    aria-label="Close"
                    onClick={onClose}
                >
                    ✖
                </button>
                <img src={src} alt={alt} />
            </div>
        </div>
    );
}
