import React from "react";
import "./styles/Wireframe.css";
import {BrowserRouter as Router, Routes, Route, useNavigate} from "react-router-dom";
import StudentView from "./pages/StudentView";
import ProfessorView from "./pages/ProfessorView";
import NewKudosPage from "./pages/NewKudosPage";
import ReviewPage from "./pages/ReviewPage";
import { useUser } from "./components/UserContext";
import Login from "./pages/Login";
import { Navigate } from "react-router-dom";
import CourseManagement from "./pages/CourseManagement";


function App(){
    const { user, loading } = useUser();

    if (loading) return <p>Loading...</p>

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path = "/home" element ={
                    user
                    ? user.role === 'STUDENT' 
                    ? <Navigate to="/studentView" /> 
                    : <Navigate to="/professorView" />
                        : <Login />}/>
                <Route path = "/login" element = {<Navigate to="/home" replace />} />
                <Route path = "/studentView" 
                    element={user && user.role === 'STUDENT' ? <StudentView/> : <Navigate to ="/login" />} />
                <Route path = "/professorView" 
                    element={user && user.role === 'INSTRUCTOR' ? <ProfessorView /> : <Navigate to ="/login" />} />
                <Route path = "/course-management" element={user && user.role === 'INSTRUCTOR' ? <CourseManagement /> : <Navigate to="/login" />} />
                <Route path="/studentView/new-kudos" element={user && user.role === 'STUDENT' ? <NewKudosPage /> : <Navigate to="/login" />} />
                <Route path="/professorView/new-kudos" element={user && user.role === 'INSTRUCTOR' ? <NewKudosPage /> : <Navigate to="/login" />} />
                <Route path = "/review" element={user && user.role === 'INSTRUCTOR' ? <ReviewPage /> : <Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;