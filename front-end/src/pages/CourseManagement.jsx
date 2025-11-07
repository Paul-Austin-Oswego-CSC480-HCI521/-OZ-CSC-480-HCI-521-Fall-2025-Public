import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ClassCard from "../components/CourseManagement/ClassCard";
import ToastMessage from "../components/Shared/ToastMessage";
import { useUser, authFetch } from "../components/UserContext";
import "../styles/Wireframe.css";
import CreateCourseModal from "../components/CourseManagement/CreateCourseModal";

function CourseManagement() {
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [toast, setToast] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const userId = user?.user_id;

  const BASE_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_BASE_URL
      : "http://backend:9080/kudo-app/api";

  // Fetch classes (wrapped in useCallback to prevent unnecessary re-renders)
  const fetchClasses = useCallback(async () => {
    if (!userId) return;

    try {
      console.log("Fetching classes for user:", userId);

      const res = await authFetch(`${BASE_URL}/users/${userId}/classes`);
      if (!res.ok) throw new Error("Failed to fetch classes");
      const data = await res.json();
      console.log("User classes data:", data);

      // Fetch each class and its students
      const classDetails = await Promise.all(
        data.class_id.map(async (id) => {
          const clsRes = await authFetch(`${BASE_URL}/class/${id}`);
          const clsData = await clsRes.json();
          const studentsRes = await authFetch(`${BASE_URL}/class/${id}/users`);
          const studentsData = await studentsRes.json();

          return {
            ...clsData.class[0],
            students: studentsData,
          };
        })
      );

      console.log("Detailed class info:", classDetails);
      setClasses(classDetails);

      // Safely set initial selection if none exists
      setSelectedClassId((prev) => {
        if (prev) {
          console.log("Keeping current selected class:", prev);
          return prev;
        }
        const firstActiveClass =
          classDetails.find((cls) => new Date(cls.end_date) >= new Date()) ||
          classDetails[0];
        if (firstActiveClass) {
          console.log("Setting initial selected class:", firstActiveClass.class_id);
          return firstActiveClass.class_id;
        }
        return null;
      });
    } catch (err) {
      console.error("Error fetching classes:", err);
      setToast({ message: "Failed to load classes.", type: "error" });
    }
  }, [userId, BASE_URL]);

  // Fetch classes once userId is available
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleClassUpdated = async (updateInfo) => {
  if (!updateInfo || !updateInfo.class_id) {
    // If no updateInfo, just refetch classes
    await fetchClasses();
    setToast({ message: "Updated successfully.", type: "success" });
    return;
  }

  // Update local state first
  setClasses((prev) =>
    prev.map((c) => (c.class_id === updateInfo.class_id ? { ...c, ...updateInfo } : c))
  );

  setToast({ message: "Class updated successfully.", type: "success" });

  // Refetch to get latest student info
  await fetchClasses();
};


  const selectedClass = classes.find((c) => c.class_id === selectedClassId);

  return (
    <div className="app-container">
      <Header showNav={true} />

      {/* Page header */}
      <div
        className="course-header-row"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div className="create-new-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ←
          </button>
          <h2>Course Management</h2>
        </div>

        <button
          className="title-button"
          onClick={() => setShowCreateModal(true)}
          style={{ padding: "12px 24px" }}
        >
          Create New Course +
        </button>
      </div>

      {/* Main content */}
      <div className="course-management-container">
        {/* Sidebar with active/archived */}
        <div className="course-sidebar">
          <h3>Active Classes</h3>
          <ul className="course-list">
            {classes
              .filter((c) => new Date(c.end_date) >= new Date())
              .map((cls) => (
                <li
                  key={cls.class_id}
                  className={cls.class_id === selectedClassId ? "selected" : ""}
                  onClick={() => {
                    console.log("Class clicked:", cls.class_id);
                    setSelectedClassId(cls.class_id);
                  }}
                >
                  {cls.class_name}
                </li>
              ))}
          </ul>

          <h3>Archived Classes</h3>
          <ul className="course-list">
            {classes
              .filter((c) => new Date(c.end_date) < new Date())
              .map((cls) => (
                <li
                  key={cls.class_id}
                  className={cls.class_id === selectedClassId ? "selected" : ""}
                  onClick={() => {
                    console.log("Class clicked:", cls.class_id);
                    setSelectedClassId(cls.class_id);
                  }}
                >
                  {cls.class_name}
                </li>
              ))}
          </ul>
        </div>

        {/* Class details */}
        <div className="course-details-section">
          <h3>Manage Courses</h3>
          {selectedClass ? (
            <>
              {console.log("Rendering ClassCard with selected class:", selectedClass)}
              <ClassCard
                classData={selectedClass}
                isActive={new Date(selectedClass.end_date) >= new Date()}
                professorId={userId}
                onClassUpdated={handleClassUpdated}
              />
            </>
          ) : (
            <p>Select a course to manage.</p>
          )}
        </div>
      </div>

      {toast && (
        <ToastMessage
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <CreateCourseModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onClassCreated={fetchClasses}
      />
    </div>
  );
}

export default CourseManagement;
