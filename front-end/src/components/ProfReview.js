import React, {useState} from "react";

function ProfReview({ onClose, onSubmit, initialData, readOnly = false }) {
    const [formData, setFormData] = useState({
        sender: initialData?.sender || '',
        recipient: initialData?.recipient || '',
        subject: initialData?.subject || '',
        message: initialData?.message || '',
        note: initialData?.note || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (readOnly) return; // prevent submission in read-only mode

        const newCard = {
            ...formData,
            id: initialData?.id || Date.now(),
            date: initialData?.date || new Date().toLocaleDateString(),
            status: initialData?.status || 'Submitted',
            recipientType: initialData?.recipientType || 'teacher',
            senderType: initialData?.senderType || 'student',
            imageUrl: initialData?.imageUrl || '/img/kudos1.png',
            read: initialData?.read ?? false,
        };

        onSubmit(newCard);
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
                                readOnly={readOnly} // disables editing
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
                                readOnly={readOnly}
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
                            readOnly={readOnly}
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
                            readOnly={readOnly}
                        />
                    </div>
                    <div className={"button-row"}>
                        <button className={"approve-reject"} type = "button">Approve</button>
                        <button className={"approve-reject"} type = "button">Reject</button>
                    </div>

                    <div className="form-group">
                        <label htmlFor={"note"}>Note to Sender:</label>
                        <textarea
                            id={"note"}
                            className={"textBox"}
                            name = "note"
                            value = {formData.note}
                            onChange = {handleChange}
                            placeholder = "Message"
                            rows = {3}
                            required
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