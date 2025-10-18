// pages/CreateUser.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../components/UserContext";
import { v4 as uuidv4 } from "uuid";
import Header from "../components/Header";
import "../styles/Wireframe.css";

function CreateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(""); // "student" or "teacher"
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  // Determine base URL dynamically based on where the app is running

  const BASE_URL =
  window.location.hostname === "localhost"
    ? process.env.REACT_APP_API_BASE_URL // running locally
    : "http://backend:9080/kudo-app/api"; // running in Docker network


  const HARD_CODED_CLASS_ID = "12345678-1234-1234-1234-123456789def";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!role) {
      setErrorMessage("Please select a role: student or teacher.");
      return;
    }

    setSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    const newUser = {
    // user_id: uuidv4(),
    email: email.trim(),
    name: name.trim(),
    password: password,
    role: role,  // "STUDENT" or "INSTRUCTOR"
    };

    try {
        console.log("Sending to backend:", JSON.stringify(newUser, null, 2));

      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      if (!res.ok) throw new Error("Failed to create user");

      const data = await res.json();

      setUser({
        user_id: data.user_id,
        name: data.name,
        email: data.email,
        role: data.role,
        classes: data.classes || []
      });

      const targetRoute = data.role === "INSTRUCTOR" ? "/professorView" : "/studentView";

setSuccessMessage(`User created successfully! Redirecting to ${data.role} view...`);

setTimeout(() => {
  navigate(targetRoute);
}, 1500);

    } catch (err) {
      console.error("Error creating user:", err);
      setErrorMessage("Could not create user. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      <Header showNav={true} />

      <div className="home-content">
        <h1>Register New User</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={submitting}
              placeholder="Enter your name"
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting}
              placeholder="Enter your email"
            />
          </label>
          <label>
            Password:
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={submitting}
            />
            </label>

          <div className="role-selection">
            <label>
              <input
                type="checkbox"
                checked={role === "STUDENT"}
                onChange={() => setRole(role === "STUDENT" ? "" : "STUDENT")}
                disabled={submitting}
              />
              Student
            </label>

            <label>
              <input
                type="checkbox"
                checked={role === "INSTRUCTOR"}
                onChange={() => setRole(role === "INSTRUCTOR" ? "" : "INSTRUCTOR")}
                disabled={submitting}
              />
              Instructor
            </label>
          </div>

          <button
            type="submit"
            className="home-button"
            disabled={submitting || !name.trim() || !email.trim() || !role}
          >
            {submitting ? "Creating..." : "Create User"}
          </button>
        </form>

        {successMessage && <p style={{ color: "green", marginTop: "1rem" }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: "red", marginTop: "1rem" }}>{errorMessage}</p>}
      </div>
    </div>
  );
}

export default CreateUser;
