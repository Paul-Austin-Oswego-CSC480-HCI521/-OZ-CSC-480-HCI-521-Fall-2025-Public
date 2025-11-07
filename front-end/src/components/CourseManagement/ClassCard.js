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
      {/* Class Info */}
      <div className="class-info">
        <h3>
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
              {className} <button onClick={() => setEditingName(true)}>✏️</button>
            </>
          )}
        </h3>

        <p>
          End Date:{" "}
          {editingEndDate ? (
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              onBlur={() => { handleUpdateField("end_date", endDate); setEditingEndDate(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") { handleUpdateField("end_date", endDate); setEditingEndDate(false); } }}
              autoFocus
            />
          ) : (
            <>
              {endDate || "N/A"} <button onClick={() => setEditingEndDate(true)}>✏️</button>
            </>
          )}
        </p>

        <p>Class Code: {classData.join_code}</p>

        {isActive && <button onClick={handleDeleteClass}>Delete Class</button>}
      </div>

      {/* Two-column layout for students */}
      <div className="class-students-container">
        <div className="student-list-column">
          <h4>Enrolled Students</h4>
          <StudentList
            students={classData.students || []}
            isEditable={isActive}
            classId={classData.class_id}
            professorId={professorId}
            onStudentRemoved={onClassUpdated}
          />
        </div>

        <div className="pending-list-column">
          <h4>Pending Requests</h4>
          <PendingRequests
            classId={classData.class_id}
            userId={professorId}
            onStudentApproved={onClassUpdated}
          />
        </div>
      </div>

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
