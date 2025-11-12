import React, { useState } from "react";
import { useUser, authFetch } from "../UserContext";

function CreateCourseModal({ open, onClose, onClassCreated }) {
  const [className, setClassName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState(""); // "success" | "error"
  const [submitting, setSubmitting] = useState(false);
  const { user } = useUser();

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  if (!open) return null;

  const handleSubmit = async (e) => {
  e.preventDefault();
  setStatusMessage("");
  setStatusType("");

  if (!className.trim() || !endDate) {
    setStatusType("error");
    setStatusMessage("Please fill in all fields.");
    return;
  }

  setSubmitting(true);

  try {
    const formattedEndDate = `${endDate}T23:59:59`;

    const res = await authFetch(
      `${BASE_URL}/class?class_name=${encodeURIComponent(
        className.trim()
      )}&created_by=${user.user_id}&end_date=${formattedEndDate}`,
      {
        method: "POST",
      }
    );

    if (!res.ok) throw new Error("Failed to create class");

    const data = await res.json();

    onClassCreated({ ...data, students: [] });
    setStatusType("success");
    setStatusMessage(`Class created! Join code: ${data.join_code}`);
    setClassName("");
    setEndDate("");
    onClose();
  } catch (err) {
    console.error(err);
    setStatusType("error");
    setStatusMessage("Failed to create class. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

return (
  <div className="modal-overlay-class">
    <div className="create-class-modal">
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
        <h2>Create New Course</h2>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Class Name</label>
          <input
            type="text"
            className="textBox"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter class name"
            required
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            className="textBox"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            disabled={submitting}
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
          <button type="submit" className="submit-btn" disabled={submitting}>
            {submitting ? "Creating..." : "Create Course"}
          </button>
          <button
            type="button"
            className="submit-btn"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
);
  
}

export default CreateCourseModal;
