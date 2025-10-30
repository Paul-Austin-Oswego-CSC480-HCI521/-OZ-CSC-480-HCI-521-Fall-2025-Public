// src/components/CourseCodeModal.jsx
import React, { useState } from "react";
import "../styles/Wireframe.css";

function CourseCodeModal({ open, onClose, onSubmit }) {
  const [courseCode, setCourseCode] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(courseCode);
    setCourseCode("");
  };

  return (
    <div className="modal-overlay-rev">
      <div className="review-page"> {/* reuse review-page styles */}
        <div className="header-row">
          <button onClick={onClose} className="icon-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
          <h2>Enter Course Code</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Course Code</label>
            <input
              type="text"
              className="textBox"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="Enter course code"
              required
            />
          </div>

          <div className="button-row">
            <button type="submit" className="submit-btn">
              Submit
            </button>
            <button type="button" className="submit-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CourseCodeModal;
