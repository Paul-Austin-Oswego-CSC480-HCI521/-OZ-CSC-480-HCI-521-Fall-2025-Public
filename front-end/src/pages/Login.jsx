import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useUser } from '../components/UserContext';
import '../styles/Wireframe.css';

function Login() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/user?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        throw new Error('User not found');
      }
      const data = await res.json();

      // Set user in context
      setUser(data);

      // Redirect based on role
      const targetRoute = data.role === 'teacher' ? '/professorView' : '/studentView';
      navigate(targetRoute);
    } catch (error) {
      setErrorMessage('Invalid email or user not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header showNav={false} />

      <div className="home-content">
        <h1>Login</h1>
        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </label>
          <button className="home-button" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
    </div>
  );
}

export default Login;
