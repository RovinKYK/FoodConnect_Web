import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Home from './pages/Home';
import AddFood from './pages/AddFood';
import EditFood from './pages/EditFood';
import FoodDetails from './pages/FoodDetails';
import MyFoods from './pages/MyFoods';
import Notifications from './pages/Notifications';
import Layout from './components/Layout';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, profileComplete } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If user is authenticated but profile is not complete, redirect to profile
  if (!profileComplete) {
    return <Navigate to="/profile" />;
  }
  
  return children;
};

// Profile Route Component (only accessible if authenticated but profile incomplete)
const ProfileRoute = ({ children }) => {
  const { isAuthenticated, loading, profileComplete } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // If profile is complete, redirect to home
  if (profileComplete) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Public Route Component (redirects to home if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, profileComplete } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  if (isAuthenticated) {
    if (profileComplete) {
      return <Navigate to="/" />;
    } else {
      return <Navigate to="/profile" />;
    }
  }
  
  return children;
};

const AppRoutes = () => {
  const { isAuthenticated, loading, profileComplete } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      {/* Profile Route - only for incomplete profiles */}
      <Route path="/profile" element={
        <ProfileRoute>
          <Profile />
        </ProfileRoute>
      } />
      
      {/* Profile Edit Route - for authenticated users to edit their profile */}
      <Route path="/edit-profile" element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Protected Routes - only for complete profiles */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Home />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/add-food" element={
        <ProtectedRoute>
          <Layout>
            <AddFood />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/edit-food/:id" element={
        <ProtectedRoute>
          <Layout>
            <EditFood />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/food/:id" element={
        <ProtectedRoute>
          <Layout>
            <FoodDetails />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/my-foods" element={
        <ProtectedRoute>
          <Layout>
            <MyFoods />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/notifications" element={
        <ProtectedRoute>
          <Layout>
            <Notifications />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Catch all route - redirect to login if not authenticated, otherwise to home */}
      <Route path="*" element={
        isAuthenticated ? <Navigate to="/" /> : <Navigate to="/login" />
      } />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
