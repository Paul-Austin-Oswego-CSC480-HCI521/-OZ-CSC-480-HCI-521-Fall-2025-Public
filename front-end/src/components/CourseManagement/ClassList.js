import React from "react";
import ClassCard from "./ClassCard";

function ClassList({ classes, isActive }) {
  if (!classes || classes.length === 0) {
    return <p>No {isActive ? "active" : "archived"} classes available.</p>;
  }

  return (
    <div className="class-list">
      {classes.map((cls) => (
        <ClassCard key={cls.class_id} classData={cls} isActive={isActive} />
      ))}
    </div>
  );
}

export default ClassList;
