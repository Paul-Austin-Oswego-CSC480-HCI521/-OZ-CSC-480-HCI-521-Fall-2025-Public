import React, { useState, useEffect } from "react";
import StudentList from "./StudentList";
import PendingRequests from "./PendingRequests";
import ToastMessage from "../Shared/ToastMessage";
import { authFetch } from "../UserContext";

function ClassCard({ classData, isActive, onClassUpdated, professorId }) {
  const [editingName, setEditingName] = useState(false);
  const [editingEndDate, setEditingEndDate] = useState(false);
  const [className, setClassName] = useState(classData.class_name);
  const [endDate, setEndDate] = useState(classData.end_date || "");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setClassName(classData.class_name);
    setEndDate(classData.end_date || "");
  }, [classData]);

  const BASE_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_BASE_URL
      : "http://backend:9080/kudo-app/api";

  const isArchived = classData.end_date && new Date(classData.end_date) < new Date();

  const handleUpdateField = async (field, value) => {
    try {
      const res = await authFetch(`${BASE_URL}/class/${classData.class_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(field === "class_name" && { class_name: value }),
          ...(field === "end_date" && { end_date: value ? new Date(value).toISOString() : null }),
        }),
      });

      if (!res.ok) throw new Error("Failed to update class");
      const updatedClass = await res.json();
      onClassUpdated(updatedClass);
      setToast({ message: `${field === "class_name" ? "Name" : "End date"} updated!`, type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to update class.", type: "error" });
    }
  };

  const handleDeleteClass = async () => {
    try {
      const res = await authFetch(`${BASE_URL}/class/${classData.class_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete class");
      onClassUpdated({ deleted: true, class_id: classData.class_id });
      setToast({ message: "Class deleted successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to delete class.", type: "error" });
    }
  };

  return (
    <div className={`class-card ${isArchived ? "archived" : ""}`}>
      <div className="class-info">
        <h2>
          {editingName ? (
            <input
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              onBlur={() => { handleUpdateField("class_name", className); setEditingName(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") { handleUpdateField("class_name", className); setEditingName(false); } }}
              autoFocus
            />
          ) : (
            <>
              {className} <button onClick={() => setEditingName(true)} className="pencil-btn" aria-label="Edit name">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-pencil"
                >
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
              </button>
            </>
          )}
        </h2>

        <p>
          End Date:{" "}
          {editingEndDate ? (
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onBlur={() => {
                handleUpdateField("end_date", endDate);
                setEditingEndDate(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUpdateField("end_date", endDate);
                  setEditingEndDate(false);
                }
              }}
              autoFocus
            />
          ) : (
            <>
              {endDate ? new Date(endDate).toISOString().split("T")[0] : "N/A"}{" "}
              <button
                onClick={() => setEditingEndDate(true)}
                className="pencil-btn"
                aria-label="Edit end date"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-pencil"
                >
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                </svg>
              </button>
            </>
          )}{" "}
          | Course Code:
          <span className="course-code-section">
            <input
              type="text"
              readOnly
              value={classData.join_code}
              className="course-code-input"
              onFocus={(e) => e.target.select()}
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(classData.join_code);
                setToast({ message: "Course code copied!", type: "success" });
              }}
              className="copy-btn"
              aria-label="Copy course code"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 512 512"
                fill="none"
                stroke="currentColor"
                strokeWidth="40"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-copy"
              >
                <path d="M128 128v256a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32V128a32 32 0 0 0-32-32H160a32 32 0 0 0-32 32z" />
                <path d="M96 384H80a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32h256a32 32 0 0 1 32 32v16" />
              </svg>
            </button>
          </span>
        </p>


      </div>

      <div className="class-students-container">
        <div className="student-list-column">
          <h4>Students in this Course</h4>
          <StudentList
            students={classData.students || []}
            isEditable={isActive}
            classId={classData.class_id}
            professorId={professorId}
            onStudentRemoved={onClassUpdated}
          />
        </div>

        <div className="pending-list-column">
          <h4>Students Pending Approval</h4>
          <PendingRequests
            classId={classData.class_id}
            userId={professorId}
            onStudentApproved={onClassUpdated}
          />
        </div>
      </div>
      {isActive && (
        <div className="delete-btn-container">
          <button className="edit-btn" onClick={handleDeleteClass}>
            Delete Course
          </button>
        </div>
      )}

      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default ClassCard;
