import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const navItems = [
    { path: '/', label: 'All Food', icon: '🍽️' },
    { path: '/my-foods', label: 'My Foods', icon: '📦' },
    { path: '/notifications', label: 'Notifications', icon: '🔔' },
  ];

  return (
    <div className="layout">
      {/* Mobile menu button */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>FoodConnect</h2>
          <button className="close-sidebar" onClick={toggleSidebar}>
            ×
          </button>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            {user?.first_name?.charAt(0) || 'U'}
          </div>
          <div className="user-details">
            <p className="user-name">
              {user?.first_name && user?.last_name 
                ? `${user.first_name} ${user.last_name}`
                : 'User'
              }
            </p>
            <p className="user-email">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <header className="main-header">
          <div className="header-content">
            <h1>FoodConnect</h1>
            <Link to="/add-food" className="add-food-btn">
              + Add Food
            </Link>
          </div>
        </header>

        <div className="content">
          {children}
        </div>
      </main>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}
    </div>
  );
};

export default Layout; 