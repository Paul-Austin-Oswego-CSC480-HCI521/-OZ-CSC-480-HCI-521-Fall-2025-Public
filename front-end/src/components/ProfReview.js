// src/components/ProfReview.jsx
import React, { useState } from "react";
import { useUser } from "../components/UserContext";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function ProfReview({ initialData }) {
    const [formData, setFormData] = useState({
        sender_id: initialData?.sender_id || "",
        recipient_id: initialData?.recipient_id || "",
        title: initialData?.title || "",
        message: initialData?.message || initialData?.content || "",
        note: initialData?.note || "",
    });

    const [selectedStatus, setSelectedStatus] = useState(null);
    const { user } = useUser();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (status) => setSelectedStatus(status);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedStatus) {
            alert("Please choose to approve or reject before submitting.");
            return;
        }
        if (selectedStatus === "REJECTED" && formData.note.trim() === "") {
            alert("Please provide a reason for rejection.");
            return;
        }

        // update status in db
        try {
            console.log(initialData);

            const updatedCard = {card_id: initialData.id,
                                 approved_by: user.user_id,
                                 status: selectedStatus,
                                 professor_note: formData.note,
                                };

            console.log(updatedCard);

            const res = await fetch( `${BASE_URL}/kudo-card`,{
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updatedCard),
                }
            );

            if (!res.ok) throw new Error("Failed to update card.");
            navigate(-1); // go back to the previous page
        } catch (error) {
            console.error("Error updating card:", error);
        }
    };

    return (
        <div className="review-page">
            <div className = "header-row">
                    <button onClick={() => navigate(-1)} className='icon-btn'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                             className="lucide lucide-arrow-left-icon lucide-arrow-left">
                            <path d="m12 19-7-7 7-7"/>
                            <path d="M19 12H5"/>
                        </svg>
                    </button>
                <h2>Review Kudo Card</h2>
            </div>
    <div className="button-row">
        <form onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-row horizontal-row">
                    <div className="form-group">
                            <label>Sender</label>
                            <input
                                className="to-from-title"
                                name="sender_id"
                                value={formData.sender_id}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label>Recipient</label>
                            <input
                                className="to-from-title"
                                name="recipient_id"
                                value={formData.recipient_id}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label>Title</label>
                            <input
                                className="to-from-title"
                                name="title"
                                value={formData.title}
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <label>Message</label>
                    <textarea
                        className="textBox"
                        name="message"
                        value={formData.message}
                        readOnly
                        rows={4}
                    />
                </div>

                <div className="button-row">
                    <button
                        type="button"
                        className={`approve-reject ${
                            selectedStatus === "APPROVED" ? "selected" : ""
                        }`}
                        onClick={() => handleStatusChange("APPROVED")}
                    >
                        Approve
                    </button>
                    <button
                        type="button"
                        className={`approve-reject ${
                            selectedStatus === "REJECTED" ? "selected" : ""
                        }`}
                        onClick={() => handleStatusChange("REJECTED")}
                    >
                        Reject
                    </button>
                </div>

                <div className="form-group">
                    <label>Reason for Rejection:</label>
                    <textarea
                        className="textBox"
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        placeholder="Message to sender"
                        rows={1}
                    />
                </div>
                    <button type="submit" className="submit-btn">
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ProfReview;
