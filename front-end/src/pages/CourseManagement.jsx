import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Tabs from "../components/Shared/Tabs";
import CreateClassForm from "../components/CourseManagement/CreateClassForm";
import ClassList from "../components/CourseManagement/ClassList";
import PendingRequests from "../components/CourseManagement/PendingRequests";
import ToastMessage from "../components/Shared/ToastMessage";
import "../styles/Wireframe.css";
import { useUser } from "../components/UserContext";

function CourseManagement() {
  const [activeTab, setActiveTab] = useState("myClasses"); // myClasses / createClass / pending
  const [classes, setClasses] = useState([]);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();
  const { user } = useUser();

  const userId = user?.user_id;

  const BASE_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_BASE_URL
      : "http://backend:9080/kudo-app/api";

  useEffect(() => {
    if (!userId) return;

    const fetchClasses = async () => {
      try {
        const res = await fetch(`${BASE_URL}/users/${userId}/classes`);
        if (!res.ok) throw new Error("Failed to fetch classes");
        const data = await res.json();

        const classDetails = await Promise.all(
          data.class_id.map(async (id) => {
            const clsRes = await fetch(`${BASE_URL}/class/${id}`);
            const clsData = await clsRes.json();
            const studentsRes = await fetch(`${BASE_URL}/class/${id}/users`);
            const studentsData = await studentsRes.json();
            return {
              ...clsData.class[0],
              students: studentsData,
            };
          })
        );

        setClasses(classDetails);
      } catch (err) {
        console.error(err);
        setToast({ message: "Failed to load classes.", type: "error" });
      }
    };

    fetchClasses();
  }, [userId, BASE_URL]);

  const handleClassCreated = (newClass) => {
    setClasses((prev) => [...prev, { ...newClass, students: [] }]);
    setToast({ message: `Class "${newClass.class_name}" created successfully!`, type: "success" });
  };

  const handleClassUpdated = (updateInfo) => {
    if (updateInfo.deleted) {
      setClasses((prev) => prev.filter((c) => c.class_id !== updateInfo.class_id));
      setToast({ message: "Class deleted successfully.", type: "success" });
    } else {
      setClasses((prev) =>
        prev.map((c) => (c.class_id === updateInfo.class_id ? updateInfo : c))
      );
      setToast({ message: "Class updated successfully.", type: "success" });
    }
  };

  return (
    <div className="app-container">
      <Header showNav={true} />
      <div className="main-content">
      <main>
        <div className="create-new-header">
          <button type='button' className='back-button' onClick={() => navigate(-1)}>←</button>
          <h2>Course Management</h2>
        </div>

        <Tabs
          tabs={[
            { label: "My Classes", value: "myClasses" },
            { label: "Create Class", value: "createClass" },
            { label: "Pending Requests", value: "pending" },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="tab-content">
          {activeTab === "myClasses" && (
            <>
              <h2>Active Classes</h2>
              <ClassList
                classes={classes.filter((c) => new Date(c.end_date) >= new Date())}
                isActive={true}
                onClassUpdated={handleClassUpdated}
              />

              <h2>Archived Classes</h2>
              <ClassList
                classes={classes.filter((c) => new Date(c.end_date) < new Date())}
                isActive={false}
                onClassUpdated={handleClassUpdated}
              />
            </>
          )}

          {activeTab === "createClass" && (
            <CreateClassForm onClassCreated={handleClassCreated} />
          )}

          {activeTab === "pending" && <PendingRequests userId={userId} />}
        </div>

        {toast && (
          <ToastMessage
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </main>
    </div>
    </div>
  );
}

export default CourseManagement;
