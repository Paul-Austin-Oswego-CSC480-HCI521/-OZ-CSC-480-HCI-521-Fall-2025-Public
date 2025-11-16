import React, { useCallback, useEffect, useState } from "react";
import '../styles/Wireframe.css';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser, authFetch } from "../components/UserContext";
import ReviewedKudosProf from "../components/ReviewedKudosProf";
import SubmittedKudosProf from "../components/SubmittedKudosProf";
import ProfReview from "../components/ProfReview";

function ProfessorView() {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const { user } = useUser();
    const navigate = useNavigate();
    const [reviewedKudos, setReviewedKudos] = useState([]);
    const [submittedKudos, setSubmittedKudos] = useState([]);
    const [selectedKudo, setSelectedKudo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getCard = async (cardId) => {
        const response = await authFetch(`${BASE_URL}/kudo-card/${cardId}?user_id=${user.user_id}`);
        if (!response.ok) {
            throw new Error(`Failed to authFetch card ${cardId}`);
        }
        return await response.json();
    };

    const getUserInfo = async (userId) => {
        try {
            const response = await authFetch(`${BASE_URL}/users/${userId}`);
            if (!response.ok) {
                throw new Error(`Failed to authFetch user ${userId}`);
            }
            const userData = await response.json();
            return userData.name;
        } catch (err) {
            console.error(`Error fetching user ${userId}:`, err);
            return "Unknown User";
        }
    };

    const getKudos = useCallback(async () => {
        if (!user?.user_id) return;
        setLoading(true);
        setError(null);
        try {

            const subRes = await authFetch(`${BASE_URL}/kudo-card/list/submitted?professor_id=${user.user_id}`);
            const subList = await subRes.json();
            const revRes = await authFetch(`${BASE_URL}/kudo-card/list/reviewed?professor_id=${user.user_id}`);
            const revList = await revRes.json();
            if (!subRes.ok || !revRes.ok) {
                throw new Error('Failed to authFetch card lists');
            }

            const subCardIds = subList.card_id || [];
            const revCardIds = revList.card_id || [];
            const allCardsIds = [...new Set([...subCardIds, ...revCardIds])];
            const cardDetails = await Promise.all(allCardsIds.map(cardId => 
                getCard(cardId)));

            cardDetails.sort((a, b) => {
                const dateA = new Date(a.created_at?.replace(/\[UTC\]$/, '') || 0);
                const dateB = new Date(b.created_at?.replace(/\[UTC\]$/, '') || 0);
                return dateB - dateA;
            });

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
            const classNamesMap = {};
            await Promise.all(
            Array.from(new Set(cardDetails.map(k => k.class_id))).map(async (classId) => {
                try {
                const res = await authFetch(`${BASE_URL}/class/${classId}`);
                if (!res.ok) throw new Error(`Class fetch failed: ${res.status}`);
                const data = await res.json();
                classNamesMap[classId] = data.class[0]?.class_name || "Unknown Class";
                } catch (err) {
                console.error(err);
                classNamesMap[classId] = "Unknown Class";
                }
            })
            );

            const formatKudo = (kudo) => {
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
                    class_id: kudo.class_id,
                    class_name: classNamesMap[kudo.class_id] || "Unknown class",
                    recipient: userNamesMap[kudo.recipient_id] || kudo.recipient_id,
                    sender: userNamesMap[kudo.sender_id] || kudo.sender_id,
                    title: kudo.title,
                    status: kudo.status,
                    date: formattedDate || "-",
                    imageUrl: kudo.imageUrl || null,
                    message: kudo.content,
                    professor_note: kudo.professor_note
                };
            };

            const sub = cardDetails
                .filter(kudo => kudo.status === "PENDING")
                .map(formatKudo);
            const rev = cardDetails
                .filter(kudo => kudo.status !== "PENDING")
                .map(formatKudo);
            setReviewedKudos(rev);
            setSubmittedKudos(sub);

        } catch (err) {
            console.error('Error fetching kudos:', err);
            setError('Failed to load kudos. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [user?.user_id, BASE_URL]);

    useEffect(() => {
        if (!user?.user_id) return;

        Promise.all([getKudos()])
    }, [getKudos, user?.user_id]);

    const handleNewKudos = () => {
        navigate('/professorView/new-kudos');
    };

    const handleSelectKudos = (kudos) => {
        setSelectedKudo(kudos)
    };

    return (
        <div className="app-container">
            <title>KudoSpace Home</title>
            <Header onCreateNew={handleNewKudos} />
            <main>
                <div className="main-content">
                <>
                    <SubmittedKudosProf submitted={submittedKudos} onSelect={handleSelectKudos} />
                    <ReviewedKudosProf reviewedKudos={reviewedKudos} onSelect={handleSelectKudos} />
                </>
                {/* )} */}
            </div></main>

            {selectedKudo && (
                <div className="modal-overlay-rev">
                    <div className="review-modal">
                        <ProfReview initialData={selectedKudo} onClose={() => {
                            setSelectedKudo(null);
                            getKudos();}} />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default ProfessorView;
