import React, { useState } from 'react';
import './Login.css';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, signup } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const handleChange = (e) => {
    if (isSignup) {
      setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (isSignup) {
      if (signupForm.password !== signupForm.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      const result = await signup(signupForm.name, signupForm.email, signupForm.password);
      if (result.success) {
        // Signup successful, user will be redirected automatically
      } else {
        setError(result.error || 'Sign up failed. Email may already be in use.');
      }
      setLoading(false);
    } else {
      const result = await login(form.email, form.password);
      if (result.success) {
        // Login successful, user will be redirected automatically
      } else {
        setError(result.error || 'Invalid email or password');
      }
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>FoodConnect</h1>
          <p>Share food, build community</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {isSignup ? (
            <>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={signupForm.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={signupForm.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={signupForm.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={signupForm.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </>
          )}
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (isSignup ? 'Signing up...' : 'Logging in...') : (isSignup ? 'Sign Up' : 'Login')}
          </button>
        </form>
        <div className="toggle-auth">
          {isSignup ? (
            <>
              <span>Already have an account?</span>
              <button type="button" className="toggle-btn" onClick={() => { setIsSignup(false); setError(''); }}>
                Log In
              </button>
            </>
          ) : (
            <>
              <span>Don't have an account?</span>
              <button type="button" className="toggle-btn" onClick={() => { setIsSignup(true); setError(''); }}>
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 