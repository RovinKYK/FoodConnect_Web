import React from 'react';
import './Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>FoodConnect</h1>
          <p>Share food, build community</p>
        </div>
        <div className="auth-buttons">
          <button 
            className="choreo-login-btn"
            onClick={() => { window.location.href = '/auth/login'; }}
          >
            Login with Choreo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login; 