import React from "react";
import { useNavigate } from "react-router-dom";

function CreateCourseSuccessModal({ open, onClose, className, joinCode }) {
    const navigate = useNavigate();
    if (!open) return null;

    const handleCopy = async () => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(joinCode);
            } else {
                const tempInput = document.createElement("input");
                tempInput.value = joinCode;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand("copy");
                document.body.removeChild(tempInput);
            }

            console.log("Copied!");
        } catch (error) {
            console.error("Copy failed", error);
        }
    };


    const handleGoToManageCourses = () => {
        onClose();
        navigate("/course-management");
    };

    return (
        <div className="modal-overlay-class">
            <div className="success-modal">
                <div className="header-row" style={{ justifyContent: "center", position: "relative" }}>
                    <h3 style={{ textAlign: "center", width: "100%", color: "#093B3B", margin: "0" }}>Course Created Successfully</h3>
                    <button
                        onClick={onClose}
                        className="close-icon"
                    >
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

                <div style={{ textAlign: "left", margin: "1rem 0" }}>
                    {className && (
                        <p>
                            Congrats, your course <strong>{className}</strong> has been successfully created.
                        </p>
                    )}

                    {joinCode && (
                        <div
                            style={{
                                display:"flex",
                                alignItems: "left",
                                gap:"0.75rem",
                                marginBottom: "0.5rem"
                            }}
                        >
                            <label>Course Code</label>
                                <div
                                    style={{
                                        position: "relative",
                                        flexGrow: "1",
                                        width:"auto",
                                        height:"auto",
                                        maxWidth:"100px"
                                    }}
                                >
                                <input
                                    type="text"
                                    value={joinCode}
                                    readOnly
                                    style={{
                                        width: "100%",
                                        padding: "8px 14px 8px 8px",
                                        border: "1px solid #093B3B",
                                        borderRadius: "6px",
                                        backgroundColor: "#FaFdF2",
                                        fontSize: "16px",
                                        fontStyle: "italic",
                                        gap: "0.5rem"
                                    }}
                                />
                                <button
                                    onClick={handleCopy}
                                    className="copy-icon"
                                    style={{
                                        position: "absolute",
                                        right: "8px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: 0
                                    }}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-copy"
                                    >
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    <p style={{ marginTop: "1rem" }}>
                        Share this code with your students so they can join the course.
                    </p>
                </div>

                <div className="button-row" style={{ justifyContent: "center" }}>
                    <button onClick={handleGoToManageCourses} className="cancel-btn">
                        Go to Manage Courses
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreateCourseSuccessModal;
