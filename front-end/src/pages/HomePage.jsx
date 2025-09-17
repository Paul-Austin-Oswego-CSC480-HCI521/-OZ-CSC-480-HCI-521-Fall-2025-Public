import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header'; // adjust path if needed
import '../styles/Wireframe.css'; // make sure this is correct

function HomePage() {
  return (
    <div className="app-container">
      {/* ✅ Tell Header not to show nav buttons */}
      <Header showNav={false} />

      <div className="home-content">
        <h1>I am a...</h1>
        <div className="home-buttons">
          <Link to="/studentView">
            <button className="home-button">Student</button>
          </Link>
          <Link to="/professorView">
            <button className="home-button">Professor</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
