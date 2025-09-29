import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Wireframe.css';

import Header from '../components/Header';
import Footer from '../components/Footer';

function NewKudosPage({ onSubmit, navigateBack }) {
    const navigate = useNavigate();

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

        fetch('http://localhost:3001/cards', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json' },
            body: JSON.stringify(newCard)
        })

        .then(res => res.json())
        .then(data => {
            console.log("Kudos submitted:", data);
            navigate('/studentView');
        })

        .catch(err => console.error("Submission failed:", err));

        setFormData({
            sender: '',
            recipient: '',
            subject: '',
            message: ''
        });

        // if (onSubmit) onSubmit(newCard);

        // setFormData({sender: '', recipient: '', subject: '', message: ''});

        // if (navigateBack) navigateBack();
    };

    return (
        <div className = "app-container">
            <Header onCreateNew={() => navigate('/studentView/new-kudos')} />

                <div className = "main-content">
                    <h1>Create a Kudo Card</h1>
                    <form onSubmit = {handleSubmit} className = "kudos-form">
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
                        <div style = {{ display: 'flex', justifyContent: 'flex-end', gap: '10px'  }}>
                            {navigateBack && (
                                <button className="close-btn" type="button" onClick={() => navigate('/studentView')}>Discard</button>
                            )} <button className="submit-btn" type = "submit">Submit</button>
                        </div>
                    </form>
                </div>
                <Footer/>
        </div>
    );
}

export default NewKudosPage;