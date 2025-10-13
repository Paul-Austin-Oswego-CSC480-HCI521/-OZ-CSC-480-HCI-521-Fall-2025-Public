// src/pages/ReviewPage.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProfReview from "../components/ProfReview";
import Header from "../components/Header";
import Footer from "../components/Footer";

function ReviewPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // The selected kudos card should be passed via state from ProfessorView
    const selectedKudos = location.state?.selectedKudos;

    // If somehow no kudos is passed, go back
    if (!selectedKudos) {
        navigate("/professorView");
        return null;
    }

    return (
        <div className="app-container">
            <Header/>
            <div className={"main-content"}>
                <ProfReview
                    initialData={selectedKudos}
                    onClose={() => navigate("/professorView")}
                    // optional: you can also pass onSubmit if you want it to update automatically
                />
            </div>
            <Footer />
        </div>
    );
}

export default ReviewPage;
