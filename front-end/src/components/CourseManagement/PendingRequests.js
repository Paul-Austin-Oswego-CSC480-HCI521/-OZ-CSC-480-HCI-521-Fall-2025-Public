import React, { useState, useEffect } from "react";
import {authFetch } from '../UserContext';

function PendingRequests({ userId }) {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const BASE_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_BASE_URL
      : "http://backend:9080/kudo-app/api";

  useEffect(() => {
    fetchPendingRequests();
  }, [userId, BASE_URL]);

  // pull the list of all pending requests
  const fetchPendingRequests = async () => {
    try {
      const res = await authFetch(`${BASE_URL}/class/pending-requests?instructor_id=${userId}`);
      if (!res.ok) throw new Error("Failed to authFetch pending requests");
      const data = await res.json();
      setPendingRequests(data || []);
      setErrorMessage("");
      console.log(data);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to load pending requests.");
    } finally {
      setLoading(false);
    }
  };

  // approve or deny a request, send action to the BE
  const handleRequestUpdate = async (classId, studentId, action) => {
    try {
      const res = await authFetch(`${BASE_URL}/class/enrollment/${studentId}/${classId}?action=${action}&instructor_id=${userId}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to approve student");
      setPendingRequests((prev) =>
        prev.filter((r) => !(r.class_id === classId && r.userId === studentId))
      );
      fetchPendingRequests();
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to approve student.");
    }
  };

  if (loading) return <p>Loading pending requests...</p>;
  if (errorMessage) return <p style={{ color: "red" }}>{errorMessage}</p>;
  if (pendingRequests.length === 0) return <p>No pending requests.</p>;

  return (
    <div className="pending-requests">
      {pendingRequests.map((req) => (
        <div key={`${req.class_id}-${req.user_id}`} className="request-card">
          <p>
            <strong>{req.student_name}</strong> ({req.student_email}) requested to join{" "}
            <strong>{req.class_name}</strong>
          </p>
          <button onClick={() => handleRequestUpdate(req.class_id, req.user_id, "approve")}>Approve</button>
          <button onClick={() => handleRequestUpdate(req.class_id, req.user_id, "deny")}>Reject</button>
        </div>
      ))}
    </div>
  );
}

export default PendingRequests;