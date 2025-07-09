import React from 'react';
import { Link } from 'react-router-dom';
import './FoodCard.css';

const FoodCard = ({ food }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const getFoodIcon = (foodType) => {
    const icons = {
      'Fruits': '🍎',
      'Vegetables': '🥬',
      'Dairy': '🥛',
      'Baked Goods': '🥖',
      'Prepared Meals': '🍽️',
      'Grains': '🌾',
      'Meat': '🥩',
      'default': '🍽️'
    };
    return icons[foodType] || icons.default;
  };

  return (
    <Link to={`/food/${food.id}`} className="food-card">
      <div className="food-card-image">
        {food.image_url ? (
          <img src={food.image_url} alt={food.food_type} />
        ) : (
          <div className="food-placeholder">
            <span className="food-icon">{getFoodIcon(food.food_type)}</span>
          </div>
        )}
      </div>
      
      <div className="food-card-content">
        <h3 className="food-type">{food.food_type}</h3>
        <h4 className="food-name">{food.food_name}</h4>
        
        <div className="food-details">
          <p className="quantity">
            {food.quantity_available} {food.quantity_unit}
          </p>
          <p className="prepared-info">
            Prepared: {formatDate(food.prepared_date)} at {formatTime(food.prepared_time)}
          </p>
        </div>
        
        {food.description && (
          <p className="description">
            {food.description.length > 100 
              ? `${food.description.substring(0, 100)}...` 
              : food.description
            }
          </p>
        )}
        
        <div className="donor-info">
          <p className="donor-name">
            By: {food.donor?.first_name} {food.donor?.last_name}
          </p>
          <p className="donor-location">
            📍 {food.donor?.address}
          </p>
        </div>
      </div>
      
      <div className="food-card-footer">
        <span className="view-details">View Details →</span>
      </div>
    </Link>
  );
};

export default FoodCard; 