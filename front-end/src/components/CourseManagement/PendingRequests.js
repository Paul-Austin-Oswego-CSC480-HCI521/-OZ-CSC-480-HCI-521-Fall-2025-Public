import React, { useState, useEffect } from "react";

function PendingRequests({ userId }) {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const BASE_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_BASE_URL
      : "http://backend:9080/kudo-app/api";

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        // TODO: Replace with actual backend endpoint for pending requests
        const res = await fetch(`${BASE_URL}/class/pending-requests?instructor_id=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch pending requests");
        const data = await res.json();
        setPendingRequests(data.requests || []);
      } catch (err) {
        console.error(err);
        setErrorMessage("Failed to load pending requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, [userId, BASE_URL]);

  const handleApprove = async (classId, studentId) => {
    try {
      const res = await fetch(`${BASE_URL}/class/${classId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: [studentId] }),
      });
      if (!res.ok) throw new Error("Failed to approve student");

      setPendingRequests((prev) =>
        prev.filter((r) => !(r.class_id === classId && r.student.user_id === studentId))
      );
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to approve student.");
    }
  };

  const handleReject = (classId, studentId) => {
    setPendingRequests((prev) =>
      prev.filter((r) => !(r.class_id === classId && r.student.user_id === studentId))
    );
  };

  if (loading) return <p>Loading pending requests...</p>;
  if (errorMessage) return <p style={{ color: "red" }}>{errorMessage}</p>;
  if (pendingRequests.length === 0) return <p>No pending requests.</p>;

  return (
    <div className="pending-requests">
      {pendingRequests.map((req) => (
        <div key={`${req.class_id}-${req.student.user_id}`} className="request-card">
          <p>
            <strong>{req.student.name}</strong> ({req.student.email}) requested to join{" "}
            <strong>{req.class_name}</strong>
          </p>
          <button onClick={() => handleApprove(req.class_id, req.student.user_id)}>Approve</button>
          <button onClick={() => handleReject(req.class_id, req.student.user_id)}>Reject</button>
        </div>
      ))}
    </div>
  );
}

export default PendingRequests;
