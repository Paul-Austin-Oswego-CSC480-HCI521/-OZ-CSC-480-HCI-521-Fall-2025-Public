import React from "react";
import './styles/Wireframe.css';
import Header from "./components/Header";
import ReceivedKudos from "./components/ReceivedKudos";
import SentKudos from "./components/SentKudos";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content">
        <ReceivedKudos />
        <SentKudos />
      </div>
      <Footer />
    </div>
  );
}

export default App;
