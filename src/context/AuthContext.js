import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);

  // Set user from JWT token
  const setUserFromToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (e) {
      setUser(null);
    }
  };

  // Set full user data
  const setFullUserData = (userData) => {
    setUser(userData);
  };

  // Check if user profile is complete
  const checkProfileComplete = async () => {
    // Only check profile completion if user is authenticated
    if (!user) {
      setProfileComplete(false);
      return;
    }

    try {
      const response = await api.get('/user/profile');
      const userProfile = response.data.user;
      setProfileComplete(!!(userProfile.first_name && userProfile.last_name && userProfile.address && userProfile.phone_number));
    } catch (error) {
      console.error('Profile check error:', error);
      setProfileComplete(false);
    }
  };

  // On mount, check for JWT in localStorage
  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      // Try to get full user data from API
      const fetchUserData = async () => {
        try {
          const response = await api.get('/auth/user');
          setFullUserData(response.data.user);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // Fallback to JWT token data
          setUserFromToken(token);
        }
      };
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  // Check profile completion when user changes
  useEffect(() => {
    if (user) {
      checkProfileComplete().finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  // Login, signup and logout methods
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('jwtToken', token);
      setFullUserData(user);
      // Profile completion will be checked in the useEffect above
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await api.post('/auth/signup', { name, email, password });
      const { token, user } = response.data;
      localStorage.setItem('jwtToken', token);
      setFullUserData(user);
      setProfileComplete(false); // New signup users need to complete profile
      setLoading(false); // Set loading to false since we know profile is incomplete
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: error.response?.data?.message || 'Signup failed' };
    }
  };
  
  const logout = () => {
    localStorage.removeItem('jwtToken');
    setUser(null);
    setProfileComplete(false);
  };

  const updateProfileComplete = (complete) => {
    setProfileComplete(complete);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    profileComplete,
    login,
    signup,
    logout,
    setUserFromToken,
    setFullUserData,
    updateProfileComplete,
    checkProfileComplete,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 