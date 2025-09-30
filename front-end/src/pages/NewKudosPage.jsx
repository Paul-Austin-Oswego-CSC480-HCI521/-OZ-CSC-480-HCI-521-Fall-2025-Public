import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Wireframe.css';

import Header from '../components/Header';
import Footer from '../components/Footer';

function NewKudosPage({ onSubmit }) {
    const navigate = useNavigate();

    const Users = [
        {userId: "123", name: "Kalley"},
        {userId: "456", name: "Hadassah"},
        {userId: "789", name: "Brittany"},
        {userId: "098", name: "Ethan"}
    ];
    const STUDENT_USER_ID = "87654321-1234-1234-1234-123456789xyz"; 
    const PLACEHOLDER_CLASS_ID = "12345678-1234-1234-1234-123456789def"; 
    
    // const [recipients, setRecipients] = useState([]);
    const recipient = ['Kalley', 'Hadassah', 'Brittany', 'Ethan'];
    const titleOptions = ['Well Done!', 'Nice Job!', 'Great Work!', 'Thank you!'];

    const [isAnonymous, setIsAnonymous] = useState(true);

    const [formData, setFormData] = useState ({
        sender: '',
        recipient: '',
        title: titleOptions[0],
        // get title() {
        //     return this.title;
        // },
        // set title(value) {
        //     this.title = value;
        // },
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

        // const newCard = {
        //     ...formData,
        //     sender: isAnonymous ? 'Anonymous' : formData.sender,
        //     id: Date.now(),
        //     date: new Date().toLocaleDateString(),
        //     status: 'Submitted',
        //     recipientType: 'teacher',
        //     senderType: 'student',
        //     imageUrl: '/img/kudos1.png',
        //     read: false
        // };

        const newCard = {
            senderId: isAnonymous ? null : STUDENT_USER_ID,
            recipientId: formData.recipient,
            classId: PLACEHOLDER_CLASS_ID,
            title: formData.title,
            content: formData.message,
            isAnonymous: isAnonymous
        }

        fetch("http://localhost:8080/kudo-app/api/kudo-card", {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newCard)
        })
        .then(res => res.json())
        .then(data => {
            console.log("Kudos submitted:", data);
            navigate(-1);
        })

        .catch(err => console.error("Submission failed:", err));

        setFormData({
            sender: '',
            recipient: '',
            title: titleOptions[0],
            message: ''
        });
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
                                    placeholder = {isAnonymous ? "Anonymous" : "Sender"}
                                    disabled = {isAnonymous}
                                    required = {!isAnonymous}
                                />
                        
                                <label style = {{ marginTop: '8px', display: 'block'}}>
                                    <input
                                    type = "checkbox"
                                    checked = {isAnonymous} 
                                    onChange = {(e) => {
                                        setIsAnonymous(e.target.checked);
                                        if (e.target.checked) {
                                            setFormData(prev => ({ ...prev, sender: 'Anonymous'}));
                                        }
                                    }} />Send Anonymously</label>
                            </div>
                                
                            <div className = "form-group">
                                <label htmlFor="recipient">Who do you want to send a Kudo to?</label>
                                <select
                                    id={"recipient"}
                                    className={"to-from-title"}
                                    name="recipient"
                                    value={formData.recipient}
                                    onChange={handleChange}
                                    required
                                    >
                                        <option value=""> -- Select a recipient --</option>
                                        {Users.map((user) => (
                                            <option key = {user.userId} value={user.userId}>
                                                {user.name}
                                            </option>
                                        ))}
                                        {/* <option value="">-- Select a recipient --</option>
                                        {recipient.map((name, index) => (
                                            <option key={index} value={name}>
                                                {name}
                                            </option>
                                        ))} */}
                                    </select>
                            </div>
                        </div>
                        <div className={"form-group"}>
                            <label htmlFor="title">Choose a Title</label>
                            <div className='title-button-group'>
                                {titleOptions.map((option, index) => (
                                    <button
                                    key = {index}
                                    type = "button"
                                    className={`title-button ${formData.title === option ? 'selected' : ''}`}
                                    onClick = {() => setFormData(prev => ({ ...prev, title: option }))}
                                >
                                    {option}
                                </button>
                            ))}
                            </div>
                            <input
                                // id={"title"}
                                // className={"to-from-title"}
                                type="hidden"
                                name="title"
                                value={formData.title}
                                // onChange={handleChange}
                                // placeholder="Title"
                                required
                            />
                        </div>
                        <div className={"form-group"}>
                            <label htmlFor={"message"}>Your Message</label>
                            <textarea
                                id={"message"}
                                className={"textBox"}
                                name = "message"
                                value = {formData.message}
                                onChange = {handleChange}
                                placeholder = "Please enter a message"
                                rows = {5}
                                required
                            />
                        </div>
                        <div className='button-row'>
                            <button
                            type = "button"
                            className="discard-btn"
                            onClick = {() => navigate(-1)}
                            >Discard</button>
                            <button 
                            type = "submit" 
                            className = "submit-btn"
                            // onClick = {() => navigate(-1)}
                            >Send Kudo</button>
                        </div>
                    </form>
                </div>
                <Footer/>
        </div>
    );
}

export default NewKudosPage;