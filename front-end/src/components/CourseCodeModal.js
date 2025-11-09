import React, { useState } from "react";
import "../styles/Wireframe.css";

function CourseCodeModal({ open, onClose, onSubmit }) {
  const [courseCode, setCourseCode] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(""); // "success" | "error"

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    setStatusType("");

    const result = await onSubmit(courseCode);

    if (result.success) {
      setStatusType("success");
      setStatusMessage(result.message);
      setCourseCode("");
    } else {
      setStatusType("error");
      setStatusMessage(result.message);
    }
  };

  return (
    <div className="review-page">
      <div className="review-page">
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

          {statusMessage && (
            <div
              className={`status-message ${
                statusType === "success" ? "success-text" : "error-text"
              }`}
            >
              {statusMessage}
            </div>
          )}

          <div className="button-row">
            <button type="submit" className="submit-btn">Submit</button>
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
