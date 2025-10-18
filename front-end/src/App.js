import React from "react";
import "./styles/Wireframe.css";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import StudentView from "./pages/StudentView";
import ProfessorView from "./pages/ProfessorView";
import NewKudosPage from "./pages/NewKudosPage";
import HomePage from "./pages/HomePage";
import ReviewPage from "./pages/ReviewPage";
import CreateUser from "./pages/CreateUser";
import Login from "./pages/Login";


function App(){

    return (
        <Router>
            {/* <nav style = {{padding:"1rem", background:"#f4f4f4"}}>
                <Link to = "/studentView" style = {{marginRight: "1rem"}}>Student View</Link>
                <Link to = "/professorView">Professor View</Link>
            </nav> */}

            <Routes>
                <Route path = "/" element = {<HomePage />}/>
                <Route path = "/login" element = {<Login />} />
                <Route path = "/studentView" element={<StudentView/>} />
                <Route path = "/professorView" element={<ProfessorView />} />
                <Route path = "/create-user" element={<CreateUser />} />
                <Route path = "/studentView/new-kudos" element={<NewKudosPage/>}/>
                <Route path = "/professorView/new-kudos" element={<NewKudosPage/>}/>
                <Route path = "/review" element={<ReviewPage />} />
            </Routes>
        </Router>
    );
}

export default App;