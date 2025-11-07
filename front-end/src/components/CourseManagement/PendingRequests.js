import React, { useState, useEffect } from "react";
import { authFetch } from '../UserContext';

function PendingRequests({ classId, userId, onStudentApproved }) {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const BASE_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_BASE_URL
      : "http://backend:9080/kudo-app/api";

  useEffect(() => {
  if (!userId) return;

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const res = await authFetch(`${BASE_URL}/class/pending-requests?instructor_id=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch pending requests");
      const data = await res.json();
      // Filter only for the selected class
      const filtered = classId ? data.filter(r => r.class_id === classId) : data;
      setPendingRequests(filtered);
      setErrorMessage("");
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to load pending requests.");
    } finally {
      setLoading(false);
    }
  };

  fetchPendingRequests();
}, [userId, classId]);


  const handleRequestUpdate = async (studentId, action) => {
    try {
      const res = await authFetch(
        `${BASE_URL}/class/enrollment/${studentId}/${classId}?action=${action}&instructor_id=${userId}`,
        { method: "PATCH" }
      );
      if (!res.ok) throw new Error("Failed to update enrollment");

      setPendingRequests((prev) => prev.filter((r) => r.user_id !== studentId));

      if (onStudentApproved) onStudentApproved({class_id : classId});
    } catch (err) {
      console.error(err);
      setErrorMessage(`Failed to ${action} student.`);
    }
  };

  if (loading) return <p>Loading pending requests...</p>;
  if (errorMessage) return <p style={{ color: "red" }}>{errorMessage}</p>;
  if (!pendingRequests.length) return <p>No pending requests.</p>;

  return (
    <div className="pending-requests">
      {pendingRequests.map((req) => (
        <div key={req.user_id} className="request-card">
          <p>
            <strong>{req.student_name}</strong> ({req.student_email}) requested to join{" "}
            <strong>{req.class_name}</strong>
          </p>
          <button onClick={() => handleRequestUpdate(req.user_id, "approve")}>Approve</button>
          <button onClick={() => handleRequestUpdate(req.user_id, "deny")}>Reject</button>
        </div>
      ))}
    </div>
  );
}

export default PendingRequests;
