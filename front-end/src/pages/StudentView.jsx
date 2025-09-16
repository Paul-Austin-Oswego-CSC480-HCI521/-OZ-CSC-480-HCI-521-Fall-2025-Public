import React, { useEffect, useState } from "react";
import '../styles/Wireframe.css';
import Header from "../components/Header";
import NewKudosForm from "../components/NewKudosForm";
import ReceivedKudosStudent from "../components/ReceivedKudosStudent";
import SentKudosStudent from "../components/SentKudosStudent";
import Footer from "../components/Footer";

function StudentView() {

    const [showForm, setShowForm] = useState(false);
    const [sentKudos, setSentKudos] = useState([]);
    const [receivedKudos, setReceivedKudos] = useState([]);
    const [submittedKudos, setSubmittedKudos] = useState([]);

    const fetchSubmittedKudos = () => {
        fetch('http://localhost:3001/cards?recipientType=teacher')
        .then(res => res.json())
        .then(data => setSubmittedKudos(data))
        .catch(err => console.error("Error fetching submitted kudos:", err));
    };
    
    const fetchSentKudos = () => {
        fetch('http://localhost:3001/cards?senderType=student')
        .then(res => res.json())
        .then(data => setSentKudos(data))
        .catch(err => console.error("Error fetching sent kudos:", err));
    };

    useEffect(() => {
        fetch('http://localhost:3001/cards')
        .then((res) => res.json())
        .then((data) => {
            setSentKudos(data.filter(msg => msg.senderType === 'student'));
            setReceivedKudos(data.filter(msg => msg.recipientType === 'student'));
        })
        .catch((err) => console.error('Error fetching kudos:', err));
        // fetchSubmittedKudos();
        // fetchSentKudos();
    }, []);

    const handleNewKudos = (newKudos) => {
        const kudosWithDate = {
            ...newKudos,
            date: new Date().toLocaleDateString(),
            recipientType: 'teacher',
            senderType: 'student',
            status: "Submitted"
        };

        fetch('http://localhost:3001/cards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(kudosWithDate)
        })
        .then(res => res.json())
        .then(data => {
            console.log("New kudos submitted:", data);
            setShowForm(false);
            fetchSubmittedKudos();
            fetchSentKudos();
        })
        .catch(err => console.error("Error saving new kudos:", err));
    };

    return (
        <div className="app-container">
            <Header onCreateNew = {() => setShowForm(true)} />
            
            {showForm && (
                <NewKudosForm 
                onClose = {() =>setShowForm(false)} 
                onSubmit = {handleNewKudos} 
            />
        )}
            <div className="main-content">
                <ReceivedKudosStudent messages = {receivedKudos} />
                <SentKudosStudent messages = {sentKudos} />
            </div>
            <Footer />
        </div>
    );
}

export default StudentView;