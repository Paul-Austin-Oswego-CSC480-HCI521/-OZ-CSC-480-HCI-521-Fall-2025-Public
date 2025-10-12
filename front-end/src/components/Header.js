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
              <button onClick={handleNotif} className="icon-btn notif-btn">
                <img src="/notification.png" alt="Notification Button" />
              </button>
              <button onClick={handleGoHome} className = "icon-btn">
                  <img src="/home.png" alt="Home Button"  />
              </button>
              <button onClick={onCreateNew} className="icon-btn">
                  <img src="/create.png" alt="New Button" />
              </button>
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
