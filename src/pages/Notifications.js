import React from 'react';
import './Notifications.css';

const Notifications = () => {
  return (
    <div className="notifications-container">
      <div className="notifications-content">
        <h2>Notifications</h2>
        <p>This page will display notifications for the user's donated food.</p>
        <p>Features to be implemented:</p>
        <ul>
          <li>List of notifications</li>
          <li>Mark as read functionality</li>
          <li>Requester information</li>
          <li>Food item details</li>
          <li>Requested amount</li>
        </ul>
      </div>
    </div>
  );
};

export default Notifications; 