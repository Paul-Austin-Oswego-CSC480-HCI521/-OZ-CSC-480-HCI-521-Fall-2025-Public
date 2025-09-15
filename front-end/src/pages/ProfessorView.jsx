import React from "react";
import '../styles/Wireframe.css';
import Header from "../components/Header";
import ReceivedKudosProf from "../components/ReceivedKudosProf";
import SentKudosProf from "../components/SentKudosProf";
import Footer from "../components/Footer";

function ProfessorView() {
    return (
        <div className="app-container">
            <Header />
            <div className="main-content">
                <ReceivedKudosProf />
                <SentKudosProf />
            </div>
            <Footer />
        </div>
    );
}

export default ProfessorView;