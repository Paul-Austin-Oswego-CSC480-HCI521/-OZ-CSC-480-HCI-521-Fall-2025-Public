import React, { useState } from "react";
import { useUser, authFetch } from "../UserContext";
import CreateCourseSuccessModal from "./CreateCourseSuccessModal";

function CreateCourseModal({ open, onClose, onClassCreated }) {
    const [className, setClassName] = useState("");
    const [endDate, setEndDate] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState(""); // "success" | "error"
    const [submitting, setSubmitting] = useState(false);

    const [successModalOpen, setSuccessModalOpen] = useState(false);
    const [createdClassName, setCreatedClassName] = useState("");
    const [createdJoinCode, setCreatedJoinCode] = useState("");

    const { user } = useUser();
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage("");
        setStatusType("");

        if (!className.trim() || !endDate) {
            setStatusType("error");
            setStatusMessage("Please fill in all fields.");
            return;
        }

        setSubmitting(true);

        try {
            const formattedEndDate = `${endDate} 00:00:00`;
            const res = await authFetch(
                `${BASE_URL}/class?class_name=${encodeURIComponent(
                    className.trim()
                )}&created_by=${user.user_id}&end_date=${formattedEndDate}`,
                {
                    method: "POST",
                }
            );

            if (!res.ok) throw new Error("Failed to create class");

            const data = await res.json();
            onClassCreated({ ...data, students: [] });

            setCreatedClassName(className);
            setCreatedJoinCode(data.join_code);

            setClassName("");
            setEndDate("");
            setStatusMessage("");
            setStatusType("");

            onClose();
            setSuccessModalOpen(true);

        } catch (err) {
            console.error(err);
            setStatusType("error");
            setStatusMessage("Failed to create class. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            {open && (
                <div className="modal-overlay-class">
                    <div className="create-class-modal">
                        <div className="header-row">
                            <h2>Create Class</h2>
                            <button onClick={onClose} className="close-icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-x"
                                >
                                    <path d="M18 6 6 18" />
                                    <path d="m6 6 12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Class Name</label>
                                <input
                                    type="text"
                                    className="textBox"
                                    value={className}
                                    onChange={(e) => setClassName(e.target.value)}
                                    placeholder="Class Name"
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            <div className="form-group">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    className="textBox"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    required
                                    disabled={submitting}
                                />
                            </div>

                            {statusMessage && (
                                <div
                                    className={`status-message ${
                                        statusType === "success" ? "success-text" : "error-text"
                                    }`}
                                >
                                    {statusMessage}
                                </div>
                            )}

                            <div className="button-row">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={onClose}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={submitting}
                                >
                                    {submitting ? "Creating..." : "Create Course"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <CreateCourseSuccessModal
                open={successModalOpen}
                onClose={() => setSuccessModalOpen(false)}
                className={createdClassName}
                joinCode={createdJoinCode}
            />
        </>
    );
}

export default CreateCourseModal;
