import React, { useCallback, useEffect, useState } from "react";
import '../styles/Wireframe.css';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser } from "../components/UserContext";
import ReviewedKudosProf from "../components/ReviewedKudosProf";
import SubmittedKudosProf from "../components/SubmittedKudosProf";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function ProfessorView() {
    const [reviewedKudos, setReviewedKudos] = useState([]);
    const [submittedKudos, setSubmittedKudos] = useState([]);
    const navigate = useNavigate();
    const { user } = useUser();

    const fetchReviewedKudos = useCallback(() => {
        if (!user?.user_id) return Promise.resolve();

        return fetch(`${BASE_URL}/kudo-card/list/reviewed?reviewer_id=${user.user_id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch reviewed kudos");
                return res.json();
            })
            .then((data) => {
                setReviewedKudos(Array.isArray(data) ? data : []);
                return true;
            });
    }, [user?.user_id]);

    const fetchSubmittedKudos = useCallback(() => {
        if (!user?.user_id) return Promise.resolve();

        return fetch(`${BASE_URL}/kudo-card/list/submitted?reviewer_id=${user.user_id}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch submitted kudos");
                return res.json();
            })
            .then((data) => {
                setSubmittedKudos(Array.isArray(data) ? data : []);
                return true;
            });
    }, [user?.user_id]);

    useEffect(() => {
        if (!user?.user_id) return;

        Promise.all([fetchReviewedKudos(), fetchSubmittedKudos()])
    }, [fetchReviewedKudos, fetchSubmittedKudos, user?.user_id]);

    const handleNewKudos = () => {
        navigate('/professorView/new-kudos');
    };

    // **Updated:** navigate to /review instead of rendering modal
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
