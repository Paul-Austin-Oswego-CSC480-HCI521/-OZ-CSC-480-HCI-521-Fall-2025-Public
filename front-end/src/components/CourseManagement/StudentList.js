import React from "react";
import { authFetch } from '../UserContext';

function StudentList({ students, isEditable, classId, professorId, onStudentRemoved}) {

  // display empty list
  if (!students || students.length === 0) {
    return <p>No students enrolled yet.</p>;
  }

  console.log(students);

  const BASE_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_BASE_URL
      : "http://backend:9080/kudo-app/api";

  const handleRemove = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to remove ${studentName} from this class?`)) {
      return;
    }
    try {
      const res = await authFetch( `${BASE_URL}/class/${classId}?user_id=${studentId}`,
        {method: "DELETE"}
      );
      if (!res.ok) { throw new Error("Failed to remove student"); }
      if (onStudentRemoved) {
        onStudentRemoved(studentId);
      }
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  return (
    <ul className="student-list">
      {students.map((student) => (
        <li key={student.id}>
          {student.name}, {student.email} - {student.role}
          {isEditable && 
          <button
            onClick={() => handleRemove(student.id, student.name)}
            disabled={professorId === student.id}
          > Remove
          </button>}
        </li>
      ))}
    </ul>
  );
}

export default StudentList;