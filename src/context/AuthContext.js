import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

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

  // Fetch user info from /auth/userinfo on mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      // Try to get user info from cookie first
      const encodedUserInfo = Cookies.get('userinfo');
      if (encodedUserInfo) {
        try {
          const userInfo = JSON.parse(atob(encodedUserInfo));
          setUser(userInfo);
          Cookies.remove('userinfo', { path: '/' });
          setLoading(false);
          return;
        } catch (e) {
          // ignore and fallback to endpoint
        }
      }
      // Fallback: fetch from endpoint
      try {
        const response = await fetch('/auth/userinfo');
        if (response.ok) {
          const userInfo = await response.json();
          setUser(userInfo);
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUserInfo();
  }, []);

  const login = () => {
    window.location.href = '/auth/login';
  };

  const logout = () => {
    const sessionHint = Cookies.get('session_hint');
    window.location.href = `/auth/logout${sessionHint ? `?session_hint=${sessionHint}` : ''}`;
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 