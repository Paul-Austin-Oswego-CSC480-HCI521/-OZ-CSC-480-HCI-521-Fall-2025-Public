import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import ClassCard from "../components/CourseManagement/ClassCard";
import ToastMessage from "../components/Shared/ToastMessage";
import { useUser, authFetch } from "../components/UserContext";
import "../styles/Wireframe.css";
import CreateCourseModal from "../components/CourseManagement/CreateCourseModal";
import Footer from "../components/Footer";

function CourseManagement() {
  const [classes, setClasses] = useState([]);
  const [archivedClasses, setArchivedClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [toast, setToast] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useUser();
  const navigate = useNavigate();

  const userId = user?.user_id;

  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const fetchClasses = useCallback(async () => {
    if (!userId) return;

    try {
      console.log("Fetching classes for user:", userId);

        const [activeRes, archivedRes] = await Promise.all([
        authFetch(`${BASE_URL}/users/${userId}/classes?is_archived=false`),
        authFetch(`${BASE_URL}/users/${userId}/classes?is_archived=true`)
      ]);

      if (!activeRes.ok || !archivedRes.ok)
        throw new Error("Failed to fetch class lists");

      const [activeData, archivedData] = await Promise.all([
        activeRes.json(),
        archivedRes.json(),
      ]);

      console.log("Active class IDs:", activeData);
      console.log("Archived class IDs:", archivedData);

      const allClassIds = [
        ...(activeData.class_id || []),
        ...(archivedData.class_id || []),
      ];

      if (allClassIds.length === 0) {
        setClasses([]);
        setArchivedClasses([]);
        return;
      }

      const detailedClasses = await Promise.all(
        allClassIds.map(async (id) => {
          const [clsRes, studentsRes] = await Promise.all([
            authFetch(`${BASE_URL}/class/${id}`),
            authFetch(`${BASE_URL}/class/${id}/users`),
          ]);

          const clsData = await clsRes.json();
          const studentsData = await studentsRes.json();

          return {
            ...clsData.class[0],
            students: studentsData,
          };
        })
      );

      const activeClasses = detailedClasses.filter((c) => !c.is_archived);
      const archivedList = detailedClasses.filter((c) => c.is_archived);

      setClasses(activeClasses);
      setArchivedClasses(archivedList);

      setSelectedClassId((prev) => {
        if (prev && detailedClasses.some((c) => c.class_id === prev)) return prev;
        const firstActive = activeClasses[0] || archivedList[0];
        return firstActive ? firstActive.class_id : null;
      });

      console.log("Detailed class info:", detailedClasses);
    } catch (err) {
      console.error("Error fetching classes:", err);
      setToast({ message: "Failed to load classes.", type: "error" });
    }
  }, [userId, BASE_URL]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowCreateModal(true);
      searchParams.delete('create');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

const handleClassUpdated = (updateInfo) => {

  if (updateInfo.deleted) {
    setClasses(prev => prev.filter(c => c.class_id !== updateInfo.class_id));
    setArchivedClasses(prev => prev.filter(c => c.class_id !== updateInfo.class_id));
    setToast({ message: "Class deleted successfully.", type: "success" });
    return;
  }

  setClasses(prev =>
  prev.map(c => c.class_id === updateInfo.class_id
    ? { ...c, ...updateInfo }
    : c)
  );
  setArchivedClasses(prev =>
    prev.map(c => c.class_id === updateInfo.class_id
      ? { ...c, ...updateInfo }
      : c)
  );
};


  const handleNewKudos = () => {
    navigate("/professorView/new-kudos");
  };

  const selectedClass =
    [...classes, ...archivedClasses].find((c) => c.class_id === selectedClassId) || null;

  return (
    <div className="app-container">
      <title>Manage Courses</title>
      <Header showNav={true} onCreateNew={handleNewKudos} />
      <div className="main-content">
        
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
            style={{ padding: "5px 5px" }}
          >
            Create New Course +
          </button>
        </div>

        <div className="course-management-container">
          <div className="course-sidebar">
            <h3>Current Courses</h3>
            <ul className="course-list">
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <li
                    key={cls.class_id}
                    className={cls.class_id === selectedClassId ? "selected" : ""}
                    onClick={() => setSelectedClassId(cls.class_id)}
                  >
                    {cls.class_name}
                  </li>
                ))
              ) : (
                <p>No active classes.</p>
              )}
            </ul>

            <h3>Archived Courses</h3>
            <ul className="course-list">
              {archivedClasses.length > 0 ? (
                archivedClasses.map((cls) => (
                  <li
                    key={cls.class_id}
                    className={cls.class_id === selectedClassId ? "selected" : ""}
                    onClick={() => setSelectedClassId(cls.class_id)}
                  >
                    {cls.class_name}
                  </li>
                ))
              ) : (
                <p>No archived classes.</p>
              )}
            </ul>
          </div>

          <div className="course-details-section">
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
      <Footer/>
    </div>
  );
}

export default CourseManagement;