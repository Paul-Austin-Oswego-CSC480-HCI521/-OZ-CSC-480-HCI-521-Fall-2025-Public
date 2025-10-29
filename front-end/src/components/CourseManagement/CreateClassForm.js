import React, { useState } from "react";

function CreateClassForm({ onClassCreated }) {
  const [className, setClassName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const BASE_URL =
    window.location.hostname === "localhost"
      ? process.env.REACT_APP_API_BASE_URL
      : "http://backend:9080/kudo-app/api";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!className.trim()) return;

    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const res = await fetch(`${BASE_URL}/class?class_name=${encodeURIComponent(className.trim())}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Failed to create class");

      const data = await res.json();
      setSuccessMessage(`Class created! Class code: ${data.class_id}`);
      onClassCreated(data);
      setClassName("");
    } catch (err) {
      console.error("Error creating class:", err);
      setErrorMessage("Could not create class. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-class-form">
      <label>
        Class Name:
        <input
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          required
          disabled={submitting}
          placeholder="Enter class name"
        />
      </label>

      <button type="submit" disabled={submitting || !className.trim()}>
        {submitting ? "Creating..." : "Create Class"}
      </button>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </form>
  );
}

export default CreateClassForm;
