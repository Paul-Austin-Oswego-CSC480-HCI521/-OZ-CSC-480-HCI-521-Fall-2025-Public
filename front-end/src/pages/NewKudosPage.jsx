import React, { useState, useEffect } from 'react';
import { useUser } from '../components/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Wireframe.css';
import { v4 as uuidv4 } from 'uuid';

import Header from '../components/Header';
import Footer from '../components/Footer';

function NewKudosPage({ onSubmit }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useUser();
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;

    const [students, setStudents] = useState([]);
    const [isAnonymous, setIsAnonymous] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);

    const PLACEHOLDER_CLASS_ID = "12345678-1234-1234-1234-123456789def";

    const titleOptions = ['Well Done!', 'Nice Job!', 'Great Work!', 'Thank you!'];
    const imageMap = {
        'Well Done!': '/images/welldone.png',
        'Nice Job!': '/images/nicejob.png',
        'Great Work!': '/images/greatwork.png',
        'Thank you!': '/images/thankyou.png'
    };

    const [formData, setFormData] = useState({
        recipient: '',
        title: titleOptions[0],
        message: '',
    });

    useEffect(() => {
        fetch(`${BASE_URL}/users?role=STUDENT`)
            .then(res => res.json())
            .then(data => {
                setStudents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load student users:", err);
                setLoading(false);
            });
    }, [BASE_URL]);

    const handleCreateNew = () => {
        const base = location.pathname.includes("studentView")
            ? "/studentView/new-kudos"
            : "/professorView/new-kudos";
        navigate(base);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePaste = (e) => {
        const pastedText = e.clipboardData.getData('text');
        console.log("Pasted from clipboard:", pastedText);
        const cleanedText = pastedText.trim();
        setFormData(prev => ({
            ...prev,
            message: prev.message + cleanedText
        }));
        e.preventDefault();
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!user) {
            alert("User not loaded yet.");
            return;
        }

        if (formData.message.length < 10 || formData.message.length > 500) {
            alert("Your message must be between 10 and 500 characters.");
            return;
        }

        const newCard = {
            card_id: uuidv4(),
            sender_id: isAnonymous ? null : user?.user_id,
            recipient_id: formData.recipient,
            class_id: PLACEHOLDER_CLASS_ID,
            title: formData.title,
            content: formData.message,
            isAnonymous: isAnonymous,
            status: "PENDING",
            approvedBy: null
        };

        fetch(`${BASE_URL}/kudo-card`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newCard)
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to submit");
                return res.json();
            })
            .then(data => {
                console.log("Kudos submitted:", data);
                navigate(-1);
            })
            .catch(err => console.error("Submission failed:", err));

        setFormData({
            recipient: '',
            title: titleOptions[0],
            message: ''
        });
    };

    if (loading) return <div className="app-container">Loading...</div>;

    return (
        <div className="app-container">
            <Header onCreateNew={handleCreateNew} />

            <div className="main-content">
                <h1>Create a Kudo Card</h1>
                <form onSubmit={handleSubmit} className="kudos-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="sender">Sender</label>
                            <input
                                id="sender_id"
                                className="to-from-title"
                                type="text"
                                value={user?.user_id || ''}
                                disabled={isAnonymous}
                                required={!isAnonymous}
                            />
                            <label style={{ marginTop: '8px', display: 'block' }}>
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                />
                                Send Anonymously
                            </label>
                        </div>

                        <div className="form-group">
                            <label htmlFor="recipient">Who do you want to send a Kudo to?</label>
                            <select
                                id="recipient"
                                className="to-from-title"
                                name="recipient"
                                value={formData.recipient}
                                onChange={handleChange}
                                required
                            >
                                <option value=""> -- Select a recipient -- </option>
                                {students.map((student) => (
                                    <option key={student.user_id} value={student.user_id}>
                                        {student.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="title">Choose a Title</label>
                        <div className="title-button-group">
                            {titleOptions.map((option, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    className={`title-button ${formData.title === option ? 'selected' : ''}`}
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, title: option }));
                                        const img = imageMap[option];
                                        if (img) setSelectedImage(img);
                                    }}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <input type="hidden" name="title" value={formData.title} required />
                    </div>

                    {/* 🖼️ Message + image container */}
                    <div className="message-image-container">
                        <div className="message-box">
                            <label htmlFor="message">Your Message</label>
                            <textarea
                                id="message"
                                className="textBox"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                onPaste={handlePaste}
                                placeholder="Please enter a message"
                                rows={6}
                                minLength={10}
                                maxLength={500}
                                required
                            />
                            <div
                                className="char-count"
                                style={{
                                    textAlign: 'right',
                                    fontSize: '0.9em',
                                    color:
                                        formData.message.length < 10 || formData.message.length > 500
                                            ? 'red'
                                            : '#555',
                                }}
                            >
                                {formData.message.length}/500
                            </div>
                        </div>

                        {selectedImage && (
                            <div className="image-preview">
                                <img src={selectedImage} alt={formData.title} />
                            </div>
                        )}
                    </div>

                    <div className="button-row">
                        <button
                            type="button"
                            className="discard-btn"
                            onClick={() => navigate(-1)}
                        >
                            Discard
                        </button>
                        <button type="submit" className="submit-btn">
                            Send Kudo
                        </button>
                    </div>
                </form>
            </div>

            <Footer />
        </div>
    );
}

export default NewKudosPage;
