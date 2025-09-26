import React, {useState} from "react";

function ProfReview({ onClose, onSubmit, initialData, readOnly = false }) {
    const [formData, setFormData] = useState({
        sender: initialData?.sender || '',
        recipient: initialData?.recipient || '',
        subject: initialData?.subject || '',
        message: initialData?.message || '',
        note: initialData?.note || '',
    });

    const [selectedStatus, setSelectedStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (status) => {
        if (readOnly) return;
        setSelectedStatus(status);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (readOnly) return;

         if (!selectedStatus) {
            alert("Please choose to approve or reject before submitting.");
            return;
        }

        if (selectedStatus === 'Rejected' && formData.note.trim() === '') {
            alert("Please provide a reason for rejection.");
            return;
        }

        const updatedCard = {
            ...formData,
            id: Number(initialData?.id),
            date: initialData?.date || new Date().toLocaleDateString(),
            status: selectedStatus,
            recipientType: selectedStatus === "Approved" ? "student" : "teacher",
//            recipient: selectedStatus === "Approved" ? initialData.recipient : initialData.recipient,
            senderType: initialData?.senderType || 'student',
            imageUrl: initialData?.imageUrl || '/img/kudos1.png',
            read: initialData?.read ?? false,
        };

//        console.log("Selected status:", selectedStatus);
//        console.log("Form data:", formData);
//        console.log("Initial data:", initialData);

        fetch(`http://localhost:3001/cards/${updatedCard.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedCard),
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to update card.");
                return res.json();
            })
            .then(data => {
                onSubmit(data);
                onClose();
            })
            .catch(err => {
                console.error("Error updating card:", err);
                alert("There was an error saving the card. Please try again.");
            });
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
                                name="sender"
                                value={formData.sender}
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
                                name="recipient"
                                value={formData.recipient}
                                onChange={handleChange}
                                placeholder="Recipient"
                                required
                                readOnly={true}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input
                            id="subject"
                            className={"to-from-title"}
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Subject"
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
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Message"
                            rows={5}
                            required
                            readOnly={true}
                        />
                    </div>
                    <div className={"button-row"}>
                        <button 
                            className={`approve-reject ${selectedStatus === 'Approved' ? 'selected' : ''}`} 
                            type = "button"
                            onClick = {() => handleStatusChange('Approved')}
                            >Approve
                        </button>
                        <button 
                            className={`approve-reject ${selectedStatus === 'Rejected' ? 'selected' : ''}`} 
                            type = "button"
                            onClick = {() => handleStatusChange('Rejected')}
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
                        <button className="close-btn" onClick={onClose}>✖</button>
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