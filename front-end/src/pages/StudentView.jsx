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

function StudentView() {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();
    const [sentKudos, setSentKudos] = useState([]);
    const [receivedKudos, setReceivedKudos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useUser();

    // get cards details 
    const getCard = async (cardId) => {
        const response = await fetch(`${BASE_URL}/kudo-card/${cardId}?user_id=${user.user_id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch card ${cardId}`);
        }
        return await response.json();
    };

    // get users info (name, email, role) from the id
    const getUserInfo = async (userId) => {
        try {
            const response = await fetch(`${BASE_URL}/users/${userId}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch user ${userId}`);
            }
            const userData = await response.json();
            return userData.name;
        } catch (err) {
            console.error(`Error fetching user ${userId}:`, err);
            return "Unknown User";
        }
    };
    
    // get all kudos (sent and received) for this user
    const getKudos = useCallback(async () => {
        if (!user?.user_id) return;
        setLoading(true);
        setError(null);
        try {

            // get list of sent card ids and list of received card ids 
            const sentRes = await fetch(`${BASE_URL}/kudo-card/list/sent?user_id=${user.user_id}`);
            const sentList = await sentRes.json();
            const receivedRes = await fetch(`${BASE_URL}/kudo-card/list/received?user_id=${user.user_id}`);
            const receivedList = await receivedRes.json();
            if (!sentRes.ok || !receivedRes.ok) {
                throw new Error('Failed to fetch card lists');
            }

            // gets card info
            const sentCardIds = sentList.card_id || [];
            const receivedCardIds = receivedList.card_id || [];
            const allCardsIds = [...new Set([...sentCardIds, ...receivedCardIds])];
            const cardDetails = await Promise.all(allCardsIds.map(cardId => 
                getCard(cardId)));

            // get the name of each user
            const userIds = new Set();
            cardDetails.forEach(kudo => {
                userIds.add(kudo.sender_id);
                userIds.add(kudo.recipient_id);
            });
            const userNamesMap = {};
            await Promise.all(
                Array.from(userIds).map(async (userId) => {
                    userNamesMap[userId] = await getUserInfo(userId);
                })
            );

            // format cards for display 
            const formatKudo = (kudo) => {
                // Format the created_at date
                let formattedDate = "-";
                if (kudo.created_at) {
                    try {
                        const cleanedDate = kudo.created_at.replace(/\[UTC\]$/, '');
                        const date = new Date(cleanedDate);
                        if (!isNaN(date.getTime())) {
                            formattedDate = date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            });
                        }
                    } catch (err) {
                        console.error('Error formatting date:', err);
                    }
                } 
                return {
                    id: kudo.card_id,
                    recipient: userNamesMap[kudo.recipient_id] || kudo.recipient_id,
                    sender: userNamesMap[kudo.sender_id] || kudo.sender_id,
                    title: kudo.title,
                    status: kudo.status,
                    date: formattedDate || "-",
                    imageUrl: kudo.imageUrl || null 
                };
            };

            const sent = cardDetails
                .filter(kudo => kudo.sender_id === user.user_id)
                .map(formatKudo);
            const received = cardDetails
                .filter(kudo => kudo.recipient_id === user.user_id && (kudo.status === "APPROVED" || kudo.status === "RECEIVED"))
                .map(formatKudo);

            setSentKudos(sent);
            setReceivedKudos(received);

        } catch (err) {
            console.error('Error fetching kudos:', err);
            setError('Failed to load kudos. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [user?.user_id, BASE_URL]);

    useEffect(() => {
        getKudos();
    }, [getKudos]);

    return (
        <div className="app-container">
            <Header onCreateNew = {() => navigate('/studentView/new-kudos')} />

            <div className="main-content">
                {loading && <p>Loading kudos...</p>}
                {error && <p style = {{ color: 'red' }}>{error}</p>}

                {!loading && !error && (
                    <>
                    <ReceivedKudosStudent received = {receivedKudos} />
                    <SentKudosStudent messages = {sentKudos} />
                    </>                 
                )}

            </div>
            <Footer />
        </div>
    );
}

export default StudentView;
