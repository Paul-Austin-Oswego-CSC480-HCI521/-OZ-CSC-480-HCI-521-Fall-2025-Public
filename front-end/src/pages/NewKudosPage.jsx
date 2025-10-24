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

    const PLACEHOLDER_CLASS_ID = "12345678-1234-1234-1234-123456789def";

    const [rosters, setRosters] = useState([]);
    const [selectedImage, setSelectedImage] = useState([]);
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState([]);
    const titleOptions = ['Well Done!', 'Nice Job!', 'Great Work!'];
    const imageMap = {
        'Well Done!': '/images/welldone.png',
        'Nice Job!': '/images/nicejob.png',
        'Great Work!': '/images/greatwork.png',
    };

    const [formData, setFormData] = useState({
        recipient: '',
        class: '',
        title: titleOptions[0],
        message: '',
    });

    useEffect(() => {
        fetch(`${BASE_URL}/users/${user.user_id}/classes`)
            .then(res => res.json())
            .then(async (data) => {

                // get list of class names and ids
                const classProm = data.class_id.map(async (classId) => {
                    const res = await fetch(`${BASE_URL}/class/${classId}`);
                    const data = await res.json();
                    return {id: classId, name: data.class[0].class_name}
                });
                const classList = await Promise.all(classProm);
                setClasses(classList);

                // if the user only has one class then auto select it 
                if (classList.length === 1) {
                setFormData(prev => ({ ...prev,
                    class: classList[0].id
                }));}
                
                // get a roster for each class 
                const rostersProm = classList.map( async (c) => {
                    const res = await fetch(`${BASE_URL}/class/${c.id}/users`);
                    const data = await res.json();
                    const roster = data.filter(student => student.id !== user.user_id);
                    return {id: c.id, name: c.name, roster: roster};
                }); 
                const rosters = await Promise.all(rostersProm);
                setRosters(rosters);
                setLoading(false);
                setSelectedImage(imageMap[0]);

            })
            .catch(err => {
                console.error("Failed to load class and roster data:", err);
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
            [name]: value,
            ...(name === 'class' ? { recipient: '' } : {})
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

        // make card json
        const newCard = {
            card_id: uuidv4(),
            sender_id: user.user_id,
            recipient_id: formData.recipient,
            class_id: formData.class,
            title: formData.title,
            content: formData.message,
            status: "PENDING",
            approvedBy: null
        };

        // send post request
        return fetch(`${BASE_URL}/kudo-card`, {
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
            navigate('/home');
            setFormData({ // reset form
                recipient: '',
                title: titleOptions[0],
                message: ''
            });
        })
        .catch(err => console.error("Submission failed:", err));

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
                            <label htmlFor="class">Select a Class</label>
                            <select
                                id="class"
                                className="to-from-title"
                                name="class"
                                value={formData.class}
                                required
                                onChange={handleChange}
                            >
                                <option value=""> -- Select a Class -- </option>
                                {classes.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="recipient">Recipient</label>
                            <select
                                id="recipient"
                                className="to-from-title"
                                name="recipient"
                                value={formData.recipient}
                                onChange={handleChange}
                                required
                                disabled={!formData.class}
                            >
                                <option value=""> -- Select a recipient -- </option>
                                {(rosters.find((r) => r.id === formData.class)?.roster || []).map( (s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>))}
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
                            <div className = "message-footer">
                                <span
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
                                </span>
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
                            onClick={() => {
                                const sure = window.confirm("Discard this Kudo? Your message will be lost.");
                                if (sure) {
                                    navigate(-1);
                                }
                            }}
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
