import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import './FoodDetails.css';

const FoodDetails = () => {
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestAmount, setRequestAmount] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchFoodDetails();
  }, [id]);

  const fetchFoodDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/food/${id}`);
      setFood(response.data.food_item);
    } catch (error) {
      console.error('Fetch food details error:', error);
      setError('Failed to load food details');
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    
    if (!requestAmount || parseFloat(requestAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (parseFloat(requestAmount) > food.quantity_available) {
      alert('Requested amount exceeds available quantity');
      return;
    }

    setRequesting(true);

    try {
      const response = await api.post(`/food/${id}/request`, {
        requested_amount: parseFloat(requestAmount)
      });

      if (response.data.message === 'Food request created successfully') {
        setRequestSuccess(true);
        // Update the food quantity in the state
        setFood(prev => ({
          ...prev,
          quantity_available: response.data.updated_quantity
        }));
        setRequestAmount('');
      }
    } catch (error) {
      console.error('Request food error:', error);
      alert(error.response?.data?.error || 'Failed to request food');
    } finally {
      setRequesting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  if (loading) {
    return (
      <div className="food-details-container">
        <div className="loading">Loading food details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="food-details-container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/')} className="back-btn">
          Back to Home
        </button>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="food-details-container">
        <div className="error-message">Food item not found</div>
        <button onClick={() => navigate('/')} className="back-btn">
          Back to Home
        </button>
      </div>
    );
  }

  const isOwnFood = food.donor?.id === user?.id;

  return (
    <div className="food-details-container">
      <div className="food-details-card">
        <div className="food-details-header">
          <button onClick={() => navigate('/')} className="back-btn">
            ← Back to Home
          </button>
          <h1>{food.food_name}</h1>
          <h2 className="food-type-subtitle">{food.food_type}</h2>
        </div>

        <div className="food-details-content">
          <div className="food-image-section">
            {food.image_url ? (
              <img src={food.image_url} alt={food.food_type} className="food-image" />
            ) : (
              <div className="no-image">No image available</div>
            )}
          </div>

          <div className="food-info-section">
            <div className="food-info">
              <h2>Food Information</h2>
              
              <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">{food.food_name}</span>
              </div>

              <div className="info-item">
                <span className="label">Type:</span>
                <span className="value">{food.food_type}</span>
              </div>

              <div className="info-item">
                <span className="label">Available:</span>
                <span className="value quantity">
                  {food.quantity_available} {food.quantity_unit === 'count' ? 'items' : 'g'}
                </span>
              </div>

              <div className="info-item">
                <span className="label">Prepared:</span>
                <span className="value">
                  {formatDate(food.prepared_date)} at {formatTime(food.prepared_time)}
                </span>
              </div>

              {food.description && (
                <div className="info-item">
                  <span className="label">Description:</span>
                  <span className="value description">{food.description}</span>
                </div>
              )}
            </div>

            <div className="donor-info">
              <h3>Donor Information</h3>
              
              <div className="info-item">
                <span className="label">Name:</span>
                <span className="value">
                  {food.donor?.first_name} {food.donor?.last_name}
                </span>
              </div>

              <div className="info-item">
                <span className="label">Address:</span>
                <span className="value">{food.donor?.address}</span>
              </div>

              <div className="info-item">
                <span className="label">Phone:</span>
                <span className="value">{food.donor?.phone_number}</span>
              </div>
            </div>

            {!isOwnFood && food.quantity_available > 0 && (
              <div className="request-section">
                <h3>Request This Food</h3>
                
                {requestSuccess && (
                  <div className="success-message">
                    Request submitted successfully! The donor will be notified.
                  </div>
                )}

                <form onSubmit={handleRequest} className="request-form">
                  <div className="form-group">
                    <label htmlFor="requestAmount">Amount Needed:</label>
                    <div className="amount-input">
                      <input
                        type="number"
                        id="requestAmount"
                        value={requestAmount}
                        onChange={(e) => setRequestAmount(e.target.value)}
                        placeholder={`Max: ${food.quantity_available}`}
                        min="0.01"
                        max={food.quantity_available}
                        step="0.01"
                        required
                      />
                      <span className="unit">{food.quantity_unit === 'count' ? 'items' : 'g'}</span>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="request-btn"
                    disabled={requesting || requestSuccess}
                  >
                    {requesting ? 'Submitting...' : 'Request Food'}
                  </button>
                </form>
              </div>
            )}

            {isOwnFood && (
              <div className="own-food-message">
                <p>This is your own food item. You cannot request it.</p>
                <button 
                  onClick={() => navigate('/my-foods')} 
                  className="view-my-foods-btn"
                >
                  View My Foods
                </button>
              </div>
            )}

            {food.quantity_available <= 0 && (
              <div className="no-stock-message">
                <p>This food item is no longer available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails; 