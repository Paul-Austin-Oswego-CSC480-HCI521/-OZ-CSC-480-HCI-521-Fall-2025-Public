import React, { useCallback, useEffect, useState } from "react";
import '../styles/Wireframe.css';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser } from "../components/UserContext";
import ProfReview from "../components/ProfReview";
import ReviewedKudosProf from "../components/ReviewedKudosProf";
import SubmittedKudosProf from "../components/SubmittedKudosProf";


function ProfessorView() {
    const [selectedKudos, setSelectedKudos] = useState(null);
    const [reviewedKudos, setReviewedKudos] = useState([]);
    const [submittedKudos, setSubmittedKudos] = useState([]);
    const navigate = useNavigate();
    const { user } = useUser();
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReviewedKudos = useCallback(() => {
        return fetch(`${BASE_URL}/kudo-card/list/reviewed?reviewer_id=${user.user_id}`)
        .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch reviewed kudos");
            return res.json();
        }) .then((data) => setReviewedKudos(data))
    }, [user.use_iId]);
        

    const fetchSubmittedKudos = useCallback(() => {
        return fetch(`${BASE_URL}/kudo-card/list/submitted?reviewer_id=${user.user_id}`)
        .then((res) => {
            if (!res.ok) throw new Error ("Failed to fetch submitted kudos");

            return res.json()
    })
        .then((data) => setSubmittedKudos(data))
    }, [user.user_id]);

        useEffect(() => {
            if (!user?.user_id) return;

            setLoading(true);
            Promise.all([fetchReviewedKudos(), fetchSubmittedKudos()])
            .catch((err) => setError("Failed to load kudos."))
            .finally(() => setLoading(false));
    }, [fetchReviewedKudos, fetchSubmittedKudos, user?.user_id]);

    const handleNewKudos = (newKudos) => {
        console.log("New kudos submitted:", newKudos);
    };

    const handleReviewSubmit = (updatedCard) => {
        console.log("Reviewed card submitted:", updatedCard);
        
        fetch(`${BASE_URL}/kudo-card/${updatedCard.card_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedCard)
        })
            .then((res) => res.json())
            .then(() => {
                fetchReviewedKudos();
                fetchSubmittedKudos();
            })
            .catch((err) => console.error("Failed to update card:", err));

        setSelectedKudos(null);
    };

    return (
        <div className="app-container">
            <Header onCreateNew = {() => navigate('/professorView/new-kudos')} />

        {selectedKudos && (
            <ProfReview
                initialData={selectedKudos}
                onClose={() => setSelectedKudos(null)}
                onSubmit={handleReviewSubmit}
                />
        )}
            <div className="main-content">
                {loading && <p>Loading kudos...</p>}
                {error && <p style = {{ color: 'red' }}>{error}</p>}

                {!loading && !error && (
                    <>
                    <SubmittedKudosProf messages = {submittedKudos} onSelect = {setSelectedKudos} />
                    <ReviewedKudosProf reviewedKudos = {reviewedKudos} />
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default ProfessorView;