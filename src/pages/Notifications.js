import React, { useState, useEffect } from 'react';
import api from '../api/api';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Fetch notifications error:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      // Update the notification in the list
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      // Update all notifications in the list
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, is_read: true }))
      );
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="loading">Loading notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchNotifications} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notifications</h1>
        {unreadCount > 0 && (
          <div className="notifications-actions">
            <span className="unread-count">{unreadCount} unread</span>
            <button onClick={markAllAsRead} className="mark-all-read-btn">
              Mark All as Read
            </button>
          </div>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="no-notifications">
          <p>No notifications yet</p>
          <p>When someone requests your food, you'll see notifications here.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-card ${!notification.is_read ? 'unread' : ''}`}
              onClick={() => !notification.is_read && markAsRead(notification.id)}
            >
              <div className="notification-content">
                <div className="notification-header">
                  <div className="requester-info">
                    <strong>
                      {notification.sender?.first_name} {notification.sender?.last_name}
                    </strong>
                    <span className="phone-number">
                      {notification.sender?.phone_number}
                    </span>
                  </div>
                  <div className="notification-meta">
                    <span className="timestamp">
                      {formatDate(notification.created_at)}
                    </span>
                    {!notification.is_read && (
                      <span className="unread-indicator">•</span>
                    )}
                  </div>
                </div>
                
                <div className="notification-body">
                  <p className="message">{notification.message}</p>
                  <div className="food-details">
                    <span className="food-type">
                      {notification.foodItem?.food_type}
                    </span>
                    <span className="requested-amount">
                      Requested: {notification.requested_amount} 
                      {notification.foodItem?.quantity_unit === 'count' ? ' items' : 'g'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications; 