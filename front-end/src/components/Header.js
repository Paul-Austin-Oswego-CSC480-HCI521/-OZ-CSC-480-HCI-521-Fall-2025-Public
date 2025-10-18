import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';
import '../styles/Wireframe.css';
import { useUser } from './UserContext';

function Header({ onCreateNew, showNav = true }) {
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const { setUser } = useUser();

  const handleGoHome = () => navigate('/home');
  const handleNotif = () => setShowNotif((v) => !v);
  const handleLogOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    setTimeout(() => {
        navigate('/home');
    }, 0);
  }

  return (
      <header className="header">
        <img src="/updatedLogo.png" alt="Animated Logo" className="logo"/>

        {showNav && (
            <nav className="nav-buttons">
              <button onClick={handleNotif} className="icon-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                       className="lucide lucide-bell-icon lucide-bell">
                      <path d="M10.268 21a2 2 0 0 0 3.464 0"/>
                      <path
                          d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>
                  </svg>
                  <span className="icon-label">Notifications</span>
              </button>
                <button onClick={handleGoHome} className="icon-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         className="lucide lucide-house-icon lucide-house">
                    <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
                        <path
                            d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    </svg>
                    <span className="icon-label">Home</span>
                </button>
                <button onClick={onCreateNew} className="icon-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         className="lucide lucide-square-plus-icon lucide-square-plus">
                        <rect width="18" height="18" x="3" y="3" rx="2"/>
                        <path d="M8 12h8"/>
                        <path d="M12 8v8"/>
                    </svg>
                    <span className="icon-label">Create</span>
                </button>
                <button onClick={handleLogOut} className="icon-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                         className="lucide lucide-grip-icon lucide-grip">
                        <circle cx="12" cy="5" r="1"/>
                        <circle cx="19" cy="5" r="1"/>
                        <circle cx="5" cy="5" r="1"/>
                        <circle cx="12" cy="12" r="1"/>
                        <circle cx="19" cy="12" r="1"/>
                        <circle cx="5" cy="12" r="1"/>
                        <circle cx="12" cy="19" r="1"/>
                        <circle cx="19" cy="19" r="1"/>
                        <circle cx="5" cy="19" r="1"/>
                    </svg>
                    <span className="icon-label">Log Out</span>
                </button>
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
