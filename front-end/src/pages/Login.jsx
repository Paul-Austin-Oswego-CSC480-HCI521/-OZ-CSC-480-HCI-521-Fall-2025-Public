import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUser } from '../components/UserContext';
import '../styles/Wireframe.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const newUser = () => navigate('/create-user');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/users/by-email?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        throw new Error('User not found');
      }
      const data = await res.json();

      // Set user in context
      setUser(data);

      // Redirect based on role
      const targetRoute = data.role === 'INSTRUCTOR' ? '/professorView' : '/studentView';
      navigate(targetRoute);
    } catch (error) {
      setErrorMessage('Invalid email or user not found');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="app-container">
          <div className="login-container">
              <div className="login-left-column">
                  <div className = "kudos-home-page">
                      <div className="home-page-logo">
                        <img src="/updatedLogo.png" alt="Logo" className="logo"/>
                      </div>
                      <div className="home-page-text">
                          <h2>Celebrate your classmates.</h2>
                          <h2>Build each other up.</h2>
                      </div>
                  </div>
              </div>
              <div className="login-right-column">
                  <form className="login-form" onSubmit={handleSubmit}>
                      <h2>Login</h2>
                      <label>
                          Email
                          <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              placeholder=""
                              disabled={loading}
                          />
                      </label>
                      <label>
                          Password
                          <input
                              type="password"
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              required
                              minLength={8}
                              disabled={submitting}
                          />
                      </label>
                      <div className="checkbox-group">
                          <input type="checkbox" id="remember" name="remember" />
                          <label htmlFor="remember">Remember me</label>
                      </div>
                      <button className="login-button" type="submit" disabled={loading}>
                          {loading ? 'Logging in...' : 'Login'}
                      </button>
                      <button className="login-button" type="submit" disabled={loading}>
                          {loading ? 'Logging in...' : 'LOG IN WITH MICROSOFT'}
                      </button>
                      <button onClick={newUser}
                        className="create-new-user">
                          <label>I need to create an account</label>
                      </button>
                  </form>
                  {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
              </div>
            </div>
        <Footer/>
      </div>
  );
}

export default Login;
