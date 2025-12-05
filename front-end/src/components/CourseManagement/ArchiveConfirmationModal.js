import React from "react";
import "../../styles/ArchiveConfirmationModal.css";

function ArchiveConfirmationModal({ isOpen, onClose, onConfirm, courseName }) {
  if (!isOpen) return null;

  return (
    <div className="archive-modal-overlay" onClick={onClose}>
      <div className="archive-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Are you sure you want to end this Course?</h2>
        <p className="archive-modal-warning">This cannot be undone.</p>

        <div className="archive-modal-buttons">
          <button className="archive-modal-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="archive-modal-accept" onClick={onConfirm}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArchiveConfirmationModal;