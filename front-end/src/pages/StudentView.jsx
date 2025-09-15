import React from "react";
import '../styles/Wireframe.css';
import Header from "../components/Header";
import ReceivedKudosStudent from "../components/ReceivedKudosStudent";
import SentKudosStudent from "../components/SentKudosStudent";
import Footer from "../components/Footer";

function StudentView() {
    return (
        <div className="app-container">
            <Header />
            <div className="main-content">
                <ReceivedKudosStudent />
                <SentKudosStudent />
            </div>
            <Footer />
        </div>
    );
}

export default StudentView;