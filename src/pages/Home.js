import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import FoodCard from '../components/FoodCard';
import './Home.css';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [townFilter, setTownFilter] = useState('');

  useEffect(() => {
    fetchFoods();
  }, [searchTerm, townFilter]);

  const fetchFoods = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (townFilter) params.town = townFilter;
      
      const response = await api.get('/food', { params });
      setFoods(response.data.food_items || []);
    } catch (error) {
      console.error('Error fetching foods:', error);
      setError('Failed to load food items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTownFilter = (e) => {
    setTownFilter(e.target.value);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setTownFilter('');
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Loading food items...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h2>Available Food Items</h2>
        <p>Find and request food from your community</p>
      </div>

      {/* Search and Filters */}
      <div className="search-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by food type..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
        <div className="filters">
          <input
            type="text"
            placeholder="Filter by town..."
            value={townFilter}
            onChange={handleTownFilter}
            className="filter-input"
          />
          
          {(searchTerm || townFilter) && (
            <button onClick={clearFilters} className="clear-filters-btn">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Food Items Grid */}
      {foods.length === 0 ? (
        <div className="no-food-message">
          <p>No food items available at the moment.</p>
          <Link to="/add-food" className="add-food-link">
            Be the first to add food!
          </Link>
        </div>
      ) : (
        <div className="food-grid">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home; 