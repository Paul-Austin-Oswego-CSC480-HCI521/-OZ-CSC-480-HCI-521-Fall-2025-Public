import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUser } from '../components/UserContext';
import '../styles/Wireframe.css';

function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mode, setMode] = useState("LG");
  const [googleSignIn, setGoogleSignIn] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();
  const BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const [name, setName] = useState("");
  const [role, setRole] = useState(""); 
  const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_CLIENT_ID; // this must be updated in .env with your own client-id
  const [googleCred, setGoogleCred] = useState(null);
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_API_KEY,
        callback: handleGoogleResponse,
      });
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          width: 300,
        }
      );
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const googleToken = response.credential;
      const payload = JSON.parse(atob(googleToken.split('.')[1]));
      setGoogleCred(googleToken);
      setName(payload.name);
      setErrorMessage('');
      setSuccessMessage('Google sign-in successful');
      handleAuth(response, googleToken);
      setGoogleSignIn(true);
    } catch (error) {
      setGoogleSignIn(false);
      setErrorMessage('Failed to process Google sign-in. Please try again.');
      console.error('Google response error:', error);
    }
  };

  const handleAuth = async (response, token) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          google_token: token,
          role: role,
          name: name
        })});

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Authentication failed');
      }

      const data = await res.json();
      localStorage.setItem('jwt_token', data.token);
      setUser(data.user);
      const targetRoute = data.user.role === 'INSTRUCTOR' ? '/professorView' : '/studentView';
      navigate(targetRoute);

    } catch (error) {
      setMode("SU");
      setErrorMessage(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAuth = async (res) => {
    res.preventDefault();
    handleAuth(res, googleCred);
    if (!googleSignIn){
      setErrorMessage("Please Sign in with your Google Account");
    }
  }

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

                    <h2>Login / Sign Up:</h2>
                    <div id="googleSignInButton" className='button-row' style={{ marginBottom: '20px' }}></div>

                    <div className="button-row">
                      <button
                          type="button"
                          className={`loginPage-button ${
                          mode === "LG" ? "selected" : ""
                          }`}
                          onClick={() => setMode("LG")}
                      >
                          Login
                      </button>
                      <button
                          type="button"
                          className={`loginPage-button ${
                          mode === "SU" ? "selected" : ""
                          }`}
                          onClick={() => setMode("SU")}
                      >
                          Sign Up
                      </button>
                    </div>

                  {mode === "SU" && (
                    <form className="login-form" onSubmit={handleNewAuth}>
                      <div className='button-row'>
                        <label>
                            Display Name
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className='textBox'
                                placeholder=""
                                disabled={loading}
                            />
                        </label>
                      </div>
                      <div className='button-row'>
                        <label>I am . . .</label>
                      </div>
                      <div className="button-row">
                        <button
                            type="button"
                            className={`loginPage-button ${
                            role === "STUDENT" ? "selected" : ""
                            }`}
                            onClick={() => setRole("STUDENT")}
                        >Student
                        </button>
                        <button
                            type="button"
                            className={`loginPage-button ${
                            role === "INSTRUCTOR" ? "selected" : ""
                            }`}
                            onClick={() => setRole("INSTRUCTOR")}
                        >Instructor
                        </button>
                      </div>
                      
                      <button className="login-button" type="submit" disabled={loading}>
                          {loading ? 'Logging in...' : 'Create Account'}
                      </button>

                    </form>
                  )}
                  
                  {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
                  {successMessage && <p style={{ color: "green", marginTop: "1rem" }}>{successMessage}</p>}
              </div>
            </div>
        <Footer/>
      </div>
  );
}

export default Login;
