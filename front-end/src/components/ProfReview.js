import React, {useState} from "react";
import { useUser } from "./UserContext";

function ProfReview({ onClose, onSubmit, initialData, readOnly = false }) {
    const [formData, setFormData] = useState({
        sender_id: initialData?.sender_id || '',
        recipient_id: initialData?.recipient_id || '',
        title: initialData?.title || '',
        message: initialData?.message || initialData?.content || '',
        note: initialData?.note || '',
    });

    const [selectedStatus, setSelectedStatus] = useState(null);
    const { user } = useUser();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (status) => {
        if (readOnly) return;
        setSelectedStatus(status);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (readOnly) return;

         if (!selectedStatus) {
            alert("Please choose to approve or reject before submitting.");
            return;
        }

        if (selectedStatus === 'REJECTED' && formData.note.trim() === '') {
            alert("Please provide a reason for rejection.");
            return;
        }

        try {
            const BASE_URL = process.env.REACT_APP_API_BASE_URL;

            const updatedCard = {
                status: selectedStatus,
                note: formData.note,
            };

            const res = await fetch(
                `${BASE_URL}/kudo-card/${initialData.card_id}?user_id=${user.user_id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedCard),
                }
            );

            if (!res.ok)
                throw new Error("Failed to update card.");

            const data = await res.json();
            onSubmit(data);
            onClose();

        } catch(error){
            console.error("Error updating card:", error);
            alert("There was an error saving the card. Please try again");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="sender">Sender</label>
                            <input
                                id="sender"
                                className={"to-from-title"}
                                name="sender_id"
                                value={formData.sender_id}
                                onChange={handleChange}
                                placeholder="Sender"
                                required
                                readOnly={true} // disables editing
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="recipient">Recipient</label>
                            <input
                                id="recipient"
                                className={"to-from-title"}
                                name="recipient_id"
                                value={formData.recipient_id}
                                onChange={handleChange}
                                placeholder="Recipient"
                                required
                                readOnly={true}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            className={"to-from-title"}
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Title"
                            required
                            readOnly={true}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            className={"textBox"}
                            name="message"
                            value={formData.message || formData.content}
                            onChange={handleChange}
                            placeholder="Message"
                            rows={5}
                            required
                            readOnly={true}
                        />
                    </div>
                    <div className={"button-row"}>
                        <button 
                            className={`approve-reject ${selectedStatus === 'APPROVED' ? 'selected' : ''}`} 
                            type = "button"
                            onClick = {() => handleStatusChange('APPROVED')}
                            >Approve
                        </button>
                        <button 
                            className={`approve-reject ${selectedStatus === 'REJECTED' ? 'selected' : ''}`} 
                            type = "button"
                            onClick = {() => handleStatusChange('REJECTED')}
                            >Reject
                        </button>
                    </div>

                    <div className="form-group">
                        <label htmlFor={"note"}>Note to Sender:</label>
                        <textarea
                            id={"note"}
                            className={"textBox"}
                            name = "note"
                            value = {formData.note}
                            onChange = {handleChange}
                            placeholder = "Message to sender"
                            rows = {3}
                        />
                    </div>

                    <div className="button-row">
                        <button type = "button" className="close-btn" onClick={onClose}>✖</button>
                        <button className="submit-btn" type = "submit">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProfReview;