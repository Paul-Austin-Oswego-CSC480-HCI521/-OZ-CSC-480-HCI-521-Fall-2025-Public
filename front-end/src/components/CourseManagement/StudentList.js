import React from "react";

function StudentList({ students, isEditable }) {
  if (!students || students.length === 0) {
    return <p>No students enrolled yet.</p>;
  }

  return (
    <ul className="student-list">
      {students.map((student) => (
        <li key={student.user_id}>
          {student.name} ({student.email}) - {student.role}
          {isEditable && <button disabled>Remove</button>}
        </li>
      ))}
    </ul>
  );
}

export default StudentList;
