import React from 'react';
import { useNavigate } from 'react-router-dom';

function Header({ onCreateNew, showNav = true }) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <header className="header">
      <img src="/logo.gif" alt="Animated Logo" className="logo" />
      {showNav && (
        <nav className="nav-buttons">
        <button onClick = {handleGoHome}>HOME</button>
        <button onClick = {onCreateNew}>CREATE NEW</button>
        <button>LOG OUT</button>
      </nav>
    )}
    </header>
  );
}

export default Header;
