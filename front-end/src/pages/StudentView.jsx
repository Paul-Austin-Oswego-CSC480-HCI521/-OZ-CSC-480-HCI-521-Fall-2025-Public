import React, { useCallback, useEffect, useState } from "react";
import '../styles/Wireframe.css';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ReceivedKudosStudent from "../components/ReceivedKudosStudent";
import SentKudosStudent from "../components/SentKudosStudent";
import { useUser } from "../components/UserContext";
import { v4 as uuidv4} from 'uuid';

// const PLACEHOLDER_CLASS_ID = "12345678-1234-1234-1234-123456789def"; 
// const TEACHER_RECIPIENT_ID = "";

function StudentView() {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();
    const [sentKudos, setSentKudos] = useState([]);
    const [receivedKudos, setReceivedKudos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useUser();

    const getCard = async (cardId) => {
        const response = await fetch(`${BASE_URL}/kudo-card/${cardId}?user_id=${user.user_id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch card ${cardId}`);
        }
        return await response.json();
    };
    
    const getKudos = useCallback(async () => {
        if (!user?.user_id) return;

        setLoading(true);
        setError(null);

        try {
            const sentRes = await fetch(`${BASE_URL}/kudo-card/list/sent?user_id=${user.user_id}`);
            const sentList = await sentRes.json();
            const receivedRes = await fetch(`${BASE_URL}/kudo-card/list/received?user_id=${user.user_id}`);
            const receivedList = await receivedRes.json();

            const sentCardIds = sentList.map(card => card.card_id);
            const receivedCardIds = receivedList.map(card => card.card_id);

            const allCardsIds = [...new Set([...sentCardIds, ...receivedCardIds])];
            const cardDetails = await Promise.all(allCardsIds.map(getCard));

            const formatKudo = (kudo) => ({
                id: kudo.card_id,
                recipient: kudo.recipient_id,
                sender: kudo.sender_id,
                title: kudo.title,
                status: kudo.status,
                date: kudo.dateSent || kudo.date || "-",
                imageUrl: kudo.imageUrl || null
            });

            const sent = cardDetails
                .filter(kudo => kudo.sender_id === user.user_id)
                .map(formatKudo);

            const received = cardDetails
                .filter(kudo => kudo.recipient_id === user.user_id)
                .map(formatKudo);

            setSentKudos(sent);
            setReceivedKudos(received);
        } catch (err) {
            console.error('Error fetching kudos:', err);
            setError('Failed to load kudos. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [user?.user_id, BASE_URL, getCard]);

    useEffect(() => {
        getKudos();
    }, [getKudos]);

    const handleNewKudos = async (newKudos) => {
        if (!user.user_id) return;
        
        const kudos = {
            // ...newKudos,
            card_id: uuidv4(),
            sender_id: user.user_id,
            recipient_id: newKudos.recipient_id,
            class_id: newKudos.class_id,
            title: newKudos.title,
            content: newKudos.message,
            isAnonymous: newKudos.isAnonymous || false,
            status: "PENDING",
            approvedBy: null
        };

        try {
            const res = await fetch(`${BASE_URL}/kudo-card`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(kudos)
            });

            if (!res.ok) throw new Error('Failed to submit kudos');

            const data = await res.json();
            console.log("New kudos submitted:", data);
            getKudos();
        } catch(err) {
            console.error("Error saving new kudos:", err);
            setError('Failed to submit kudos. Please try again.');
        }
    }; 

    return (
        <div className="app-container">
            <Header onCreateNew = {() => navigate('/studentView/new-kudos')} />

            <div className="main-content">
                {loading && <p>Loading kudos...</p>}
                {error && <p style = {{ color: 'red' }}>{error}</p>}

                {!loading && !error && (
                    <>
                    <ReceivedKudosStudent messages = {receivedKudos} />
                    <SentKudosStudent messages = {sentKudos} />
                    </>                 
                )}

            </div>
            <Footer />
        </div>
    );
}

export default StudentView;
