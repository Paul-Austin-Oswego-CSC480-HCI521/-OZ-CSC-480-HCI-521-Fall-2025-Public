import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import '../styles/Wireframe.css';

function Header({ onCreateNew, showNav = true }) {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);


  const [notifications] = useState([
    { id: 1, title: 'Reminder', message: 'Team meeting at 3 PM.', time: 'Today • 10:15 AM', read: false },
    { id: 2, title: 'Kudos approved', message: 'Your Kudos to Prof. Lee was approved.', time: 'Yesterday • 4:22 PM', read: true },
  ]);

  const handleGoHome = () => navigate('/');
  const handleNotif = () => setShowNotif((v) => !v);

  return (
      <header className="header">
        <img src="/logo.gif" alt="Animated Logo" className="logo" />

        {showNav && (
            <nav className="nav-buttons">
              <button onClick={handleNotif} className="icon-btn" aria-label="Open notifications">
                <img src="/notifImage.png" alt="" className="notifButton" />
              </button>
              <button onClick={handleGoHome}>HOME</button>
              <button onClick={onCreateNew}>CREATE NEW</button>
              <button>LOG OUT</button>
            </nav>
        )}

        <Notification
            open={showNotif}
            onClose={() => setShowNotif(false)}
            items={notifications}
        />
      </header>
  );
}

export default Header;
