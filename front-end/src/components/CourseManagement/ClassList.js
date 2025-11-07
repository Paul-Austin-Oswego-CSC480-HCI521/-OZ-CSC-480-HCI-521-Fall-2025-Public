import React from "react";
import ClassCard from "./ClassCard";

function ClassList({ classes, isActive, onClassUpdated, professorId }) {
  return (
    <div className="class-list">
      {classes.map((c) => (
        <ClassCard
          key={c.class_id}
          classData={c}
          isActive={isActive}
          professorId={professorId}
          onClassUpdated={onClassUpdated}
        />
      ))}
    </div>
  );
}


export default ClassList;