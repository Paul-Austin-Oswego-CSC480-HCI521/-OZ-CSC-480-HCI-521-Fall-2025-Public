import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Notification from './Notification';
import '../styles/Wireframe.css';
import {useUser} from './UserContext';
import CourseCodeModal from './CourseCodeModal';

function Header({ onCreateNew, showNav = true }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);
  const { user, setUser, courseSubmit } = useUser();
  const [showCourseModal, setShowCourseModal] = useState(false);
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleCourseAddition = () => setShowCourseModal(true);
  const handleCourseManagement = () => navigate('/course-management');
  const handleMailPage = () => navigate("/studentView");
  const handleGoHome = () => navigate('/home');
  const handleNotif = () => setShowNotif((v) => !v);

  const handleLogOut = () => {
    setUser(null);
    localStorage.removeItem('jwt_token');
    setTimeout(() => {
      navigate('/home');
    }, 0);
  };

  const handleCourseSubmit = async (code) => {
    const res = await courseSubmit(code);
    return res;
  }

  const isSelected = (path) => {
    if (path === '/home') {
      return (
        location.pathname === '/home' ||
        ((location.pathname === '/studentView') && (user.role === 'STUDENT')) ||
        location.pathname === '/professorView'
      );
    }
    if (path === '/new-kudos') {
      return (
        location.pathname === '/studentView/new-kudos' ||
        location.pathname === '/professorView/new-kudos'
      );
    }
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className='logo-title-group' >
        <img
          src="/updatedLogoV2.png"
          alt="Kudo Space Logo"
          className="logoSmall"
          onClick={handleGoHome}
          style={{ cursor: 'pointer' }}
        />
        <div className="header-kudoSpace-text"><h2 onClick={handleGoHome}>KudoSpace</h2></div>
      </div>

      {showNav && (
        <nav className="nav-buttons">
          <button
            onClick={handleNotif}
            className={`icon-btn notif-btn ${showNotif ? 'selected' : ''}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-bell"
            >
              <path d="M10.268 21a2 2 0 0 0 3.464 0" />
              <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
            </svg>
            <span className="icon-label">Notifications</span>
          </button>

          <button
            onClick={handleGoHome}
            className={`icon-btn ${isSelected('/home') ? 'selected' : ''}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-house"
            >
              <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
              <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            </svg>
            <span className="icon-label">Home</span>
          </button>

          {user?.role === 'INSTRUCTOR' && (
            <button onClick={handleMailPage} 
            className={`icon-btn ${isSelected('/studentView') ? 'selected' : ''}`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                class="lucide lucide-mail-open-icon lucide-mail-open"
              >
                <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"/>
                <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10"/>
              </svg>
              <span className="icon-label">Mail</span>
            </button>
          )}

          <button
            onClick={onCreateNew}
            className={`icon-btn ${isSelected('/new-kudos') ? 'selected' : ''}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-square-plus"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M8 12h8" />
              <path d="M12 8v8" />
            </svg>
            <span className="icon-label">Create</span>
          </button>

          {user?.role === 'STUDENT' && (
            <button onClick={handleCourseAddition} className="icon-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-book-plus"
              >
                <path d="M12 4v16" />
                <path d="M8 8h8" />
                <path d="M4 19V5a2 2 0 0 1 2-2h10" />
              </svg>
              <span className="icon-label">Add Course</span>
            </button>
          )}

          {user?.role === 'INSTRUCTOR' && (
            <button 
            onClick={handleCourseManagement} 
            className={`icon-btn ${isSelected('/course-management') ? 'selected' : ''}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-book-cog"
              >
                <path d="M4 19V5a2 2 0 0 1 2-2h10" />
                <path d="M12 10h4" />
                <path d="M12 14h4" />
                <circle cx="18" cy="18" r="3" />
                <path d="M18 15v6" />
                <path d="M15 18h6" />
              </svg>
              <span className="icon-label">Manage Courses</span>
            </button>
          )}

          <button
            onClick={handleLogOut}
            className={`icon-btn ${isSelected('/logout') ? 'selected' : ''}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-log-out"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="icon-label">Log Out</span>
          </button>
        </nav>
      )}

      <Notification open={showNotif} onClose={() => setShowNotif(false)} />

      {showCourseModal && (
        <div className="modal-overlay-rev">
          <div className="code-modal">
            <CourseCodeModal
              open={showCourseModal}
              onClose={() => setShowCourseModal(false)}
              onSubmit={handleCourseSubmit}
            />
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;

