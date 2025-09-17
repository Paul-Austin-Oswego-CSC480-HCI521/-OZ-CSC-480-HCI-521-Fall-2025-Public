import React, { useState } from 'react';
import '../styles/Wireframe.css';

function NewKudosForm({ onClose, onSubmit }) {
    const [formData, setFormData] = useState ({
        sender: '',
        recipient: '',
        subject: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) =>{
        e.preventDefault();

        const newCard = {
            ...formData,
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            status: 'Submitted',
            recipientType: 'teacher',
            senderType: 'subject',
            imageUrl: '/img/kudos1.png',
            read: false
        };

        onSubmit(newCard);

        setFormData({sender: '', recipient: '', subject: '', message: ''});
    };

    return (
        <div className = "modal-overlay">
            <div className = "modal-content">
                <form onSubmit = {handleSubmit}>
                    <div className ="form-row">
                        <div className={"form-group"}>
                            <label htmlFor="sender">Sender</label>
                            <input
                                id = "sender"
                                className={"to-from-title"}
                                type = "text"
                                name = "sender"
                                value = {formData.sender}
                                onChange = {handleChange}
                                placeholder = "Sender"
                                required
                            />
                        </div>
                        <div className={"form-group"}>
                            <label htmlFor="recipient">Recipient</label>
                            <input
                                id={"recipient"}
                                className={"to-from-title"}
                                type="text"
                                name="recipient"
                                value={formData.recipient}
                                onChange={handleChange}
                                placeholder="Recipient"
                                required
                            />
                        </div>
                    </div>
                    <div className={"form-group"}>
                        <label htmlFor="subject">Subject</label>
                        <input
                            id={"subject"}
                            className={"to-from-title"}
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Subject"
                            required
                        />
                    </div>
                    <div className={"form-group"}>
                        <label htmlFor={"message"}>Message</label>
                        <textarea
                            id={"message"}
                            className={"textBox"}
                            name = "message"
                            value = {formData.message}
                            onChange = {handleChange}
                            placeholder = "Message"
                            rows = {5}
                            required
                        />
                    </div>
                    <div style = {{ display: 'flex', justifyContent: 'space-between'  }}>
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

export default NewKudosForm;