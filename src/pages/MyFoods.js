import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import './MyFoods.css';

const MyFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyFoods();
  }, []);

  const fetchMyFoods = async () => {
    try {
      setLoading(true);
      const response = await api.get('/food/myfoods');
      setFoods(response.data.food_items);
    } catch (error) {
      console.error('Fetch my foods error:', error);
      setError('Failed to load your foods');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (foodId) => {
    navigate(`/edit-food/${foodId}`);
  };

  const handleDelete = async (foodId) => {
    try {
      await api.delete(`/food/${foodId}`);
      setFoods(prev => prev.filter(food => food.id !== foodId));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Delete food error:', error);
      alert('Failed to delete food item');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (loading) {
    return (
      <div className="my-foods-container">
        <div className="loading">Loading your foods...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-foods-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchMyFoods} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="my-foods-container">
      <div className="my-foods-header">
        <h1>My Foods</h1>
        <button 
          onClick={() => navigate('/add-food')} 
          className="add-food-btn"
        >
          Add More Food
        </button>
      </div>

      {foods.length === 0 ? (
        <div className="no-foods">
          <p>You haven't donated any food yet.</p>
          <p>Start sharing food with your community!</p>
          <button 
            onClick={() => navigate('/add-food')} 
            className="add-first-food-btn"
          >
            Add Your First Food Item
          </button>
        </div>
      ) : (
        <div className="foods-grid">
          {foods.map(food => (
            <div key={food.id} className="food-card">
              {food.image_url && (
                <div className="food-image">
                  <img src={food.image_url} alt={food.food_type} />
                </div>
              )}
              
              <div className="food-content">
                <h3 className="food-type">{food.food_type}</h3>
                <h4 className="food-name">{food.food_name}</h4>
                
                <div className="food-details">
                  <p className="quantity">
                    {food.quantity_available} {food.quantity_unit === 'count' ? 'items' : 'g'}
                  </p>
                  <p className="prepared-info">
                    Prepared: {formatDate(food.prepared_date)} at {formatTime(food.prepared_time)}
                  </p>
                  {food.description && (
                    <p className="description">{food.description}</p>
                  )}
                </div>

                <div className="food-actions">
                  <button 
                    onClick={() => handleEdit(food.id)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm(food.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {deleteConfirm === food.id && (
                <div className="delete-confirmation">
                  <p>Are you sure you want to delete this food item?</p>
                  <div className="confirmation-actions">
                    <button 
                      onClick={() => setDeleteConfirm(null)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleDelete(food.id)}
                      className="confirm-delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFoods; 