import React, { useCallback, useEffect, useState } from "react";
import '../styles/Wireframe.css';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ReceivedKudosStudent from "../components/ReceivedKudosStudent";
import SentKudosStudent from "../components/SentKudosStudent";
import { useUser } from "../components/UserContext";

// const STUDENT_USER_ID = "87654321-1234-1234-1234-123456789xyz"; 
const PLACEHOLDER_CLASS_ID = "12345678-1234-1234-1234-123456789def"; 
const TEACHER_RECIPIENT_ID = "12345678-1234-1234-1234-123456789abc";

function StudentView() {

    const API_URL = "http://kudos-app:8080/kudo-app/api";
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState();
    const [sentKudos, setSentKudos] = useState([]);
    const [receivedKudos, setReceivedKudos] = useState([]);
    const { user } = useUser();

    // const fetchSubmittedKudos = () => {
    //     fetch('http://localhost:3001/cards?recipientType=teacher')
    //     .then(res => res.json())
    //     .then(data => setSubmittedKudos(data))
    //     .catch(err => console.error("Error fetching submitted kudos:", err));
    // };
    
    // const fetchSentKudos = () => {
    //     fetch('http://localhost:3001/cards?senderType=student')
    //     .then(res => res.json())
    //     .then(data => setSentKudos(data))
    //     .catch(err => console.error("Error fetching sent kudos:", err));
    // };

    //fetch cards by ID
    const getCard = async (cardId) => {
        const response = await fetch(`${API_URL}/kudo-card/${cardId}?user_id=${user.id}`);
        if (!response.ok) throw new Error(`Failed to fetch card ${cardId}`)
            return response.json();
    };
    
    const getKudos = useCallback(() => {
        let sentCardIds = [];
        let recievedCardIds = [];

        return fetch(`${API_URL}/kudo-card/list/sent?user_id=${user.id}`)
        .then(res => res.json())
        .then(sentList => {sentCardIds = sentList.card_id || [];
            return fetch(`${API_URL}/kudo-card/list/recieved?user_id=${user.id}`)
        })
        .then(res => res.json())
        .then(recievedList => {recievedCardIds = recievedList.card_id || [];

            const allCardsIds = [...new Set([...sentCardIds, ...recievedCardIds])];
            const cardDetails = allCardsIds.map(getCard)
            return Promise.all(cardDetails);
        })
        .then(allKudos => {
            const sent = allKudos.filter(kudo => kudo.sender_id === user.id);
            const recieved = allKudos.filter(kudo => kudo.recipient_id === user.id);

            setSentKudos(sent);
            setReceivedKudos(recieved);
        })
        .catch((err) => console.error('Error fetching kudos:', err));
    }, [user.id]);

    useEffect(() => {
        getKudos();
    }, [getKudos]);

    // useEffect(() => {
    //     fetch(`http://localhost:3001/cards`)
    //     .then((res) => res.json())
    //     .then((data) => {
    //         setSentKudos(data.filter(msg => msg.senderType === 'student'));
    //         setReceivedKudos(data.filter(msg => msg.recipientType === 'student'));
    //     })
    //     .catch((err) => console.error('Error fetching kudos:', err));
    //     // fetchSubmittedKudos();
    //     // fetchSentKudos();
    // }, []);

    const handleNewKudos = (newKudos) => {
        
        const kudos = {
            ...newKudos,
            senderId: user.id,
            recipientId: TEACHER_RECIPIENT_ID,
            classId: PLACEHOLDER_CLASS_ID,
            isAnonymous: newKudos.isAnonymous || false
        }

        // const kudosWithDate = {
        //     ...newKudos,
        //     date: new Date().toLocaleDateString(),
        //     recipientType: 'teacher',
        //     senderType: 'student',
        //     status: "Submitted"
        // };

        // fetch('http://localhost:3001/cards', 
        fetch(`${API_URL}/kudo-card`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(kudos)
        })
        .then(res => res.json())
        .then(data => {
            console.log("New kudos submitted:", data);
            setShowForm(false);
            // fetchSubmittedKudos();
            // fetchSentKudos();
            getKudos();
        })
        .catch(err => console.error("Error saving new kudos:", err));
    };

    return (
        <div className="app-container">
            <Header onCreateNew = {() => navigate('/studentView/new-kudos')} />

            <div className="main-content">
                <ReceivedKudosStudent messages = {receivedKudos} />
                <SentKudosStudent messages = {sentKudos} />
            </div>
            <Footer />
        </div>
    );
}

export default StudentView;