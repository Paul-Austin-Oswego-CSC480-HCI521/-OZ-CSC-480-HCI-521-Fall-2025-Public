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
          <div className="form-group">
              <button
                  className="close-btn"
                  style={{backgroundColor: "white"}}
                  onClick={onClose}
                  aria-label="Close kudos modal">
                  ✖
              </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Class Code</label>
            <div className="button-row" style={{margin: "0px"}}>
              <input
              type="text"
              className="textBox"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="Enter course code"
              required
            />
            <button className="sb2">Submit</button>
            </div>
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
        </form>
      </div>
    </div>
  );
}

export default CourseCodeModal;
