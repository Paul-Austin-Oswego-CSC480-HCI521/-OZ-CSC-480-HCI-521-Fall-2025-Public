import React, { useEffect, useState } from "react";
import '../styles/Wireframe.css';
import Header from "../components/Header";
import NewKudosForm from "../components/NewKudosForm";
import ReceivedKudosProf from "../components/SubmittedKudosProf";
import ProfReview from "../components/ProfReview";
import SentKudosProf from "../components/ReviewedKudosProf";
import Footer from "../components/Footer";

function ProfessorView() {
    const [showForm, setShowForm] = useState(false);
    const [selectedKudos, setSelectedKudos] = useState(null);
    const [reviewedKudos, setReviewedKudos] = useState([])

    useEffect(() => {
        fetchReviewedKudos();
    }, []);

    const fetchReviewedKudos = () => {
        fetch("http://localhost:3001/cards")
        .then((res) => res.json())
        .then((data) => {
            const reviewed = data.filter(
                (card) =>
                    card.status === "Approved" ||
                (typeof card.status === "string" && card.status.startsWith("Rejected"))
            );
            setReviewedKudos(reviewed);
        })
        .catch((err) => console.error("Error fetching reviewed kudos:", err));
    };

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
            })
            .catch((err) => console.error("Failed to update card:", err));

        setSelectedKudos(null);
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

        {selectedKudos && (
            <ProfReview
                initialData={selectedKudos}
                onClose={() => setSelectedKudos(null)}
                onSubmit={handleReviewSubmit}
                />
        )}
            <div className="main-content">
                <ReceivedKudosProf onReview = {handleReviewSubmit}/>
                <SentKudosProf reviewedKudos = {reviewedKudos} />
            </div>
            <Footer />
        </div>
    );
}

export default ProfessorView;