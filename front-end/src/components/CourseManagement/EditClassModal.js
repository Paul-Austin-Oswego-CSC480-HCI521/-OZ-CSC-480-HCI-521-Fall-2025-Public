import React, { useState } from "react";
import ConfirmModal from "../CourseManagement/ConfirmModal";
import ToastMessage from "../Shared/ToastMessage";

function EditClassModal({ classData, onClose, onUpdate }) {
  const [className, setClassName] = useState(classData.class_name);
  const [endDate, setEndDate] = useState(classData.end_date || "");
  const [students, setStudents] = useState(classData.students || []);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [confirmAction, setConfirmAction] = useState(null);
  const [toast, setToast] = useState(null);

  const BASE_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_BASE_URL
      : "http://backend:9080/kudo-app/api";

  const handleRemoveStudent = async (studentId) => {
    try {
      const res = await fetch(
        `${BASE_URL}/class/${classData.class_id}?user_id=${studentId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to remove student");

      setStudents(students.filter((s) => s.user_id !== studentId));
      setToast({ message: "Student removed successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to remove student.");
      setToast({ message: "Failed to remove student.", type: "error" });
    }
  };

  const handleDeleteClass = async () => {
    try {
      const res = await fetch(`${BASE_URL}/class/${classData.class_id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete class");

      onUpdate({ deleted: true, class_id: classData.class_id });
      setToast({ message: "Class deleted successfully!", type: "success" });
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to delete class.");
      setToast({ message: "Failed to delete class.", type: "error" });
    }
  };

  const handleSave = async () => {
    // Placeholder for editing class info
    alert("Edit class info saving not implemented yet.");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Class</h2>
        <label>
          Class Name:
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>

        <h3>Students</h3>
        <ul>
          {students.map((student) => (
            <li key={student.user_id}>
              {student.name} ({student.email})
              <button
                onClick={() =>
                  setConfirmAction({
                    type: "removeStudent",
                    studentId: student.user_id,
                  })
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        <div className="modal-actions">
          <button onClick={handleSave} disabled={submitting}>
            Save
          </button>
          <button
            onClick={() => setConfirmAction({ type: "deleteClass" })}
            disabled={submitting}
          >
            Delete Class
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>

        {confirmAction && (
          <ConfirmModal
            message={
              confirmAction.type === "deleteClass"
                ? "Are you sure you want to delete this class?"
                : "Are you sure you want to remove this student?"
            }
            onConfirm={() => {
              if (confirmAction.type === "deleteClass") handleDeleteClass();
              else if (confirmAction.type === "removeStudent")
                handleRemoveStudent(confirmAction.studentId);
              setConfirmAction(null);
            }}
            onCancel={() => setConfirmAction(null)}
          />
        )}

        {toast && (
          <ToastMessage
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}

export default EditClassModal;
