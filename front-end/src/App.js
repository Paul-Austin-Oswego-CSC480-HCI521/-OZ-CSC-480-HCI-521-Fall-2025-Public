import React from "react";
import "./styles/Wireframe.css";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import StudentView from "./pages/StudentView";
import ProfessorView from "./pages/ProfessorView";
import HomePage from "./pages/HomePage";


function App(){

    return (
        <BrowserRouter>
            {/* <nav style = {{padding:"1rem", background:"#f4f4f4"}}>
                <Link to = "/studentView" style = {{marginRight: "1rem"}}>Student View</Link>
                <Link to = "/professorView">Professor View</Link>
            </nav> */}

            <Routes>
                <Route path = "/" element = {<HomePage />}/>
                <Route path = "/studentView" element={<StudentView/>} />
                <Route path = "/professorView" element={<ProfessorView />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;