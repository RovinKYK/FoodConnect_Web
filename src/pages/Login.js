import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [choreoUserId, setChoreoUserId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, signup, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    try {
      const userData = {
        choreo_user_id: choreoUserId,
        email: email
      };

      let result;
      if (isSignup) {
        result = await signup(userData);
      } else {
        result = await login(userData);
      }

      if (result.requiresProfile) {
        navigate('/profile');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChoreoLogin = () => {
    // Placeholder for Choreo OAuth flow
    // In production, this would redirect to Choreo's OAuth endpoint
    alert('Choreo OAuth integration would be implemented here');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>FoodConnect</h1>
          <p>Share food, build community</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="auth-buttons">
          <button 
            className="choreo-login-btn"
            onClick={handleChoreoLogin}
            disabled={loading}
          >
            {isSignup ? 'Sign up with Choreo' : 'Login with Choreo'}
          </button>
        </div>

        <div className="divider">
          <span>or</span>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="choreoUserId">Choreo User ID</label>
            <input
              type="text"
              id="choreoUserId"
              value={choreoUserId}
              onChange={(e) => setChoreoUserId(e.target.value)}
              placeholder="Enter your Choreo User ID"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Login')}
          </button>
        </form>

        <div className="toggle-auth">
          <p>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
            <button 
              className="toggle-btn"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 