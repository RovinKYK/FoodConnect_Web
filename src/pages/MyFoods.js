import React from 'react';
import './MyFoods.css';

const MyFoods = () => {
  return (
    <div className="my-foods-container">
      <div className="my-foods-content">
        <h2>My Foods</h2>
        <p>This page will display all food items donated by the current user.</p>
        <p>Features to be implemented:</p>
        <ul>
          <li>List of user's donated foods</li>
          <li>Edit food items</li>
          <li>Delete food items</li>
          <li>View request status</li>
          <li>Add more food button</li>
        </ul>
      </div>
    </div>
  );
};

export default MyFoods; 