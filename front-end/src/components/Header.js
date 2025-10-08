import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import '../styles/Wireframe.css';

function Header({ onCreateNew, showNav = true }) {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);

  const handleGoHome = () => navigate('/');
  const handleNotif = () => setShowNotif((v) => !v);

  return (
      <header className="header">
        <img src="/logo.gif" alt="Animated Logo" className="logo" />

        {showNav && (
            <nav className="nav-buttons">
              <button onClick={handleNotif} className="icon-btn" aria-label="Open notifications">
                <img src="/notifImage.png" alt="Notification Button" className="notifButton" />
              </button>
              <button onClick={handleGoHome}>HOME</button>
              <button onClick={onCreateNew}>CREATE NEW</button>
              <button>LOG OUT</button>
            </nav>
        )}

        <Notification
            open={showNotif}
            onClose={() => setShowNotif(false)}
            // items={notifications}
        />
      </header>
  );
}

export default Header;
