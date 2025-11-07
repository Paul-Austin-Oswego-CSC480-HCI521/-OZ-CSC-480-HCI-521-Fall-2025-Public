import React, { useState } from "react";
import { authFetch } from '../UserContext';
import ToastMessage from "../Shared/ToastMessage";

function StudentList({ students, isEditable, classId, professorId, onStudentRemoved }) {
  const [toast, setToast] = useState(null);

  if (!students || students.length === 0) {
    return <p>No students enrolled yet.</p>;
  }

  const BASE_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_BASE_URL
      : "http://backend:9080/kudo-app/api";

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRemove = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to remove ${studentName} from this class?`)) {
      return;
    }
    try {
      const res = await authFetch(`${BASE_URL}/class/${classId}?user_id=${studentId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to remove student.");
      }

      if (onStudentRemoved) {
        onStudentRemoved({ class_id: classId, message: `${studentName} removed successfully.` });
      }

      showToast(`${studentName} removed successfully!`, "success");

    } catch (err) {
      console.error(err);
      showToast(err.message || "Error removing student.", "error");
    }
  };

  return (
    <>
      <ul className="student-list">
        {students.map((student) => (
          <li key={student.id}>
            {student.name}, {student.email} - {student.role}
            {isEditable && (
              <button
                onClick={() => handleRemove(student.id, student.name)}
                disabled={professorId === student.id}
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default StudentList;
