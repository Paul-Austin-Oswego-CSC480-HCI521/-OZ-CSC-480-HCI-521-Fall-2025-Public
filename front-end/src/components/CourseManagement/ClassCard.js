import React, { useState } from "react";
import StudentList from "./StudentList";
import EditClassModal from "./EditClassModal";

function ClassCard({ classData, isActive, onClassUpdated }) {
  const [showRoster, setShowRoster] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const toggleRoster = () => setShowRoster((prev) => !prev);

  const handleUpdate = (updateInfo) => {
    if (updateInfo.deleted) {
      onClassUpdated({ deleted: true, class_id: classData.class_id });
    } else {
      onClassUpdated(updateInfo);
    }
  };

  return (
    <div className="class-card">
      <div className="class-info">
        <h3>{classData.class_name}</h3>
        <p>End Date: {classData.end_date || "N/A"}</p>
        <p>Class Code: {classData.class_id}</p>
        <button onClick={toggleRoster}>
          {showRoster ? "Hide Roster" : "View Roster"}
        </button>
        {isActive && <button onClick={() => setShowEditModal(true)}>Edit Class</button>}
      </div>

      {showRoster && (
        <div className="student-roster">
          <StudentList students={classData.students || []} isEditable={isActive} />
        </div>
      )}

      {showEditModal && (
        <EditClassModal
          classData={classData}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

export default ClassCard;
