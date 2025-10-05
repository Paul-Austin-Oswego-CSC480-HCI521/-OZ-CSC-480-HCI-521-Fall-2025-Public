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
    const [showForm, setShowForm] = useState(false);
    const [selectedKudos, setSelectedKudos] = useState(null);
    const [reviewedKudos, setReviewedKudos] = useState([]);
    const [submittedKudos, setSubmittedKudos] = useState([]);
    const navigate = useNavigate();
    const { user } = useUser();

    const fetchReviewedKudos = useCallback(() => {
        fetch(`http://localhost:3001/cards?status=approved,rejected&reviewerId=${user.id}`)
        .then((res) => res.json())
        .then((data) => 
            // { const reviewed = data.filter(
        //         (card) =>
        //             card.status === "Approved" ||
        //         (typeof card.status === "string" && card.status.startsWith("Rejected"))
        //     );
            setReviewedKudos(data))
        // })
        .catch((err) => console.error("Error fetching reviewed kudos:", err));
    }, [user.id]);

    const fetchSubmittedKudos = useCallback(() => {
        fetch(`http://localhost:3001/cards?status=pending&reviewerId=${user.id}`)
        .then((res) => res.json())
        .then((data) => setSubmittedKudos(data))
        .catch(err => console.error("Error fetching submitted kudos:", err));
    }, [user.id]);

        useEffect(() => {
        fetchReviewedKudos();
        fetchSubmittedKudos();
    }, [fetchReviewedKudos, fetchSubmittedKudos]);

    const handleNewKudos = (newKudos) => {
        console.log("New kudos submitted:", newKudos);
        setShowForm(false);
    };

    const handleReviewSubmit = (updatedCard) => {
        console.log("Reviewed card submitted:", updatedCard);
        
        fetch(`http://localhost:3001/cards/${updatedCard.id}`, {
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
            
            {/* {showForm && (
                <NewKudosForm 
                onClose = {() =>setShowForm(false)} 
                onSubmit = {handleNewKudos} 
            />
        )} */}

        {selectedKudos && (
            <ProfReview
                initialData={selectedKudos}
                onClose={() => setSelectedKudos(null)}
                onSubmit={handleReviewSubmit}
                />
        )}
            <div className="main-content">
                {/* <ReceivedKudosProf onReview = {handleReviewSubmit}/> */}
                <SubmittedKudosProf messages = {submittedKudos} onSelect = {setSelectedKudos} />
                <ReviewedKudosProf reviewedKudos = {reviewedKudos} />
            </div>
            <Footer />
        </div>
    );
}

export default ProfessorView;