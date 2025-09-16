import React, { useState } from 'react';

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
            <div className = "modal-content" style = {{maxWidth: '500px' }}>
                <h2>Create New Kudos</h2>
                <form onSubmit = {handleSubmit} style = {{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input
                    type = "text"
                    name = "sender"
                    value = {formData.sender}
                    onChange = {handleChange}
                    placeholder = "Sender"
                    required
                    />
                     <input
                        type="text"
                        name="recipient"
                        value={formData.recipient}
                        onChange={handleChange}
                        placeholder="Recipient"
                        required
                    />
                    <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Subject"
                        required
                    />
                    <textarea
                        name = "message"
                        value = {formData.message}
                        onChange = {handleChange}
                        placeholder = "Message"
                        rows = {5}
                        required
                    />
                    <div style = {{ display: 'flex', justifyContent: 'space-between' }}>
                        <button type = "button" onClick = {onClose} style = {{ backgroundColor: '#ccc'}}>
                            Cancel
                        </button>
                        <button type = "submit" style = {{backgroundColor: '#05888A', color: 'white'}}>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default NewKudosForm;