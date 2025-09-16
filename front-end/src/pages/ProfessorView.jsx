import React, { useState } from "react";
import '../styles/Wireframe.css';
import Header from "../components/Header";
import NewKudosForm from "../components/NewKudosForm";
import ReceivedKudosProf from "../components/SubmittedKudosProf";
import SentKudosProf from "../components/ReviewedKudosProf";
import Footer from "../components/Footer";

function ProfessorView() {

    const [showForm, setShowForm] = useState(false);
    const handleNewKudos = (newKudos) => {
        console.log("New kudos submitted:", newKudos);
        setShowForm(false);
    }

    return (
        <div className="app-container">
            <Header onCreateNew = {() => setShowForm(true)} />
            
            {showForm && (
                <NewKudosForm 
                onClose = {() =>setShowForm(false)} 
                onSubmit = {handleNewKudos} 
            />
        )}
            <div className="main-content">
                <ReceivedKudosProf />
                <SentKudosProf />
            </div>
            <Footer />
        </div>
    );
}

export default ProfessorView;