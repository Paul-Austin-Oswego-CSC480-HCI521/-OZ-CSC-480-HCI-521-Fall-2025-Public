import React, { useCallback, useEffect, useState } from "react";
import '../styles/Wireframe.css';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ReceivedKudosStudent from "../components/ReceivedKudosStudent";
import SentKudosStudent from "../components/SentKudosStudent";
import { useUser, authFetch } from "../components/UserContext";
import CourseCodeModal from '../components/CourseCodeModal';

function StudentView() {
    const { user, courseSubmit, getClasses, getCard, getUserInfo} = useUser();
    const [receivedSortOrder, setReceivedSortOrder] = useState("desc");
    const [showCourseModal, setShowCourseModal] = useState(false);
    const [rejectionInfo, setRejectionInfo] = useState(null);
    const [sentSortOrder, setSentSortOrder] = useState("desc");
    const [receivedKudos, setReceivedKudos] = useState([]);
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const [sentFilter, setSentFilter] = useState("ALL");
    const [hasClass, setHasClass] = useState(false);
    const [sentKudos, setSentKudos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const handleRejectedCardClick = (rejectionReason) => { setRejectionInfo(rejectionReason); };
    const closeRejectionModal = () => { setRejectionInfo(null); };
    const handleReceivedSort = () => { setReceivedSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));}
    const handleSentSort = () => { setSentSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));}
    const handleFilterChange = () => { console.log("Filter button clicked");}
    const handleCourseManagement = () => navigate('/course-management?create=true');
    const handleCourseAddition = () => setShowCourseModal(true);

    const handleCourseSubmit = async (code) => {
        const res = await courseSubmit(code);
        return res;
    }

    // get all kudos (sent and received) for this user
    const getKudos = useCallback(async () => {
        if (!user?.user_id) return;
        setLoading(true);
        setError(null);
        try {

            // get list of sent card ids and list of received card ids 
            const sentRes = await authFetch(`${BASE_URL}/kudo-card/list/sent?user_id=${user.user_id}`);
            const sentList = await sentRes.json();
            const receivedRes = await authFetch(`${BASE_URL}/kudo-card/list/received?user_id=${user.user_id}`);
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

            // sort by date
            cardDetails.sort((a, b) => {
                const dateA = new Date(a.created_at?.replace(/\[UTC\]$/, '') || 0);
                const dateB = new Date(b.created_at?.replace(/\[UTC\]$/, '') || 0);
                return dateB - dateA;
            });

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

            // get class list
            const classList = await getClasses();
            const classNamesMap = {};
            classList.forEach((c) => {
                classNamesMap[c.classId] = c.name;
            });
            setHasClass(Object.keys(classNamesMap).length > 0 );

            
            const formatKudo = (kudo) => {

                // format the created_at date
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

                // format card data
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
            setLoading(false);}
    }, [user?.user_id, BASE_URL]);

    useEffect(() => {
        getKudos();
    }, [getKudos]);

    const sortedReceived = [...receivedKudos].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return receivedSortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    const filteredSent = sentKudos.filter((k) =>
        sentFilter === "ALL" ? true : k.status === sentFilter
    );

    const sortedSent = [...filteredSent].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sentSortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return (
        <div className="app-container">
            <title>KudoSpace Home</title>
            <Header onCreateNew = {() => navigate('/studentView/new-kudos')} />

            <div className="main-content">
                {loading && <p>Loading kudos...</p>}
                {error && <p style = {{ color: 'red' }}>{error}</p>}

                {!loading && !error && hasClass && (
                    <>
                    <ReceivedKudosStudent received = {sortedReceived} />
                    <SentKudosStudent messages = {sortedSent} onRejectedCardClick={handleRejectedCardClick}/>
                    </>                 
                )}

                {!loading && !hasClass && !error && (user.role === 'INSTRUCTOR') && (
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
                        <h2>You have not created any courses</h2>
                        <button className="edit-btn" onClick={handleCourseManagement} style={{ width: "250px" }}>Create a Course</button>
                    </div>
                )}
                {!loading && !hasClass && !error && (user.role === 'STUDENT') && (
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
                        <h2>You are not registered to any courses</h2>
                        <button className="edit-btn" onClick={handleCourseAddition} style={{ width: "300px" }}>Register for a course</button>
                    </div>
                )}

                {showCourseModal && (
                    <div className="modal-overlay-rev">
                        <div className="code-modal">
                            <CourseCodeModal
                            open={showCourseModal}
                            onClose={() => setShowCourseModal(false)}
                            onSubmit={handleCourseSubmit}
                            />
                        </div>
                    </div>
                )}

            </div>
            <Footer />
        </div>
    );
}

export default StudentView;
