import React, { useCallback, useEffect, useState } from "react";
import '../styles/Wireframe.css';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser } from "../components/UserContext";
import ReviewedKudosProf from "../components/ReviewedKudosProf";
import SubmittedKudosProf from "../components/SubmittedKudosProf";

function ProfessorView() {
    const BASE_URL = process.env.REACT_APP_API_BASE_URL;
    const { user } = useUser();
    const navigate = useNavigate();
    const [reviewedKudos, setReviewedKudos] = useState([]);
    const [submittedKudos, setSubmittedKudos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchReviewedKudos = useCallback(async () => {
        if (!user?.user_id) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${BASE_URL}/kudo-card/list/reviewed?professor_id=${user.user_id}`);
            if (!res.ok) throw new Error("Failed to fetch reviewed kudos");
            const data = await res.json();
            
            const cards = await Promise.all(
                (data.card_id || []).map(id =>
                    fetch(`${BASE_URL}/kudo-card/${id}?user_id=${user.user_id}`).then(r => r.json())
                )
            );

            setReviewedKudos(cards);
        } catch (err) {
            console.error(err);
            setError("Failed to load kudos. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [user?.user_id]);

    const fetchSubmittedKudos = useCallback(async () => {
        if (!user?.user_id) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${BASE_URL}/kudo-card/list/submitted?professor_id=${user.user_id}`);
            if (!res.ok) throw new Error("Failed to fetch submitted kudos");
            const data = await res.json();

            const cards = await Promise.all(
                (data.card_id || []).map(id =>
                    fetch(`${BASE_URL}/kudo-card/${id}?user_id=${user.user_id}`).then(r => r.json())
                )
            );

            setSubmittedKudos(cards);
        } catch (err) {
            console.error(err);
            setError("Failed to load kudos. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [user?.user_id]);

    useEffect(() => {
        if (!user?.user_id) return;

        Promise.all([fetchReviewedKudos(), fetchSubmittedKudos()])
    }, [fetchReviewedKudos, fetchSubmittedKudos, user?.user_id]);

    const handleNewKudos = () => {
        navigate('/professorView/new-kudos');
    };

    const handleSelectKudos = (kudos) => {
        navigate("/review", { state: { initialData: kudos } });
    };

    return (
        <div className="app-container">
            <Header onCreateNew={handleNewKudos} />

            <div className="main-content">
                <>
                    <SubmittedKudosProf messages={submittedKudos} onSelect={handleSelectKudos} />
                    <ReviewedKudosProf reviewedKudos={reviewedKudos} />
                </>
                {/* )} */}
            </div>
            <Footer />
        </div>
    );
}

export default ProfessorView;
