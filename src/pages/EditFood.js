import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/api';
import './AddFood.css'; // Reuse AddFood styles

const EditFood = () => {
  const [formData, setFormData] = useState({
    food_type: '',
    quantity_available: '',
    quantity_unit: 'count',
    prepared_date: '',
    prepared_time: '',
    description: '',
    image_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();

  const foodTypes = [
    'Fruits',
    'Vegetables',
    'Dairy',
    'Baked Goods',
    'Prepared Meals',
    'Grains',
    'Legumes',
    'Nuts & Seeds',
    'Beverages',
    'Other'
  ];

  useEffect(() => {
    fetchFoodItem();
  }, [id]);

  const fetchFoodItem = async () => {
    try {
      const response = await api.get(`/food/${id}`);
      const food = response.data.food_item;
      
      setFormData({
        food_type: food.food_type,
        quantity_available: food.quantity_available.toString(),
        quantity_unit: food.quantity_unit,
        prepared_date: food.prepared_date,
        prepared_time: food.prepared_time,
        description: food.description || '',
        image_url: food.image_url || ''
      });
      
      if (food.image_url) {
        setImagePreview(food.image_url);
      }
    } catch (error) {
      console.error('Fetch food item error:', error);
      setErrors({ general: 'Failed to load food item' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.image_url;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.food_type.trim()) {
      newErrors.food_type = 'Food type is required';
    }
    
    if (!formData.food_name.trim()) {
      newErrors.food_name = 'Food name is required';
    }
    
    if (!formData.quantity_available || parseFloat(formData.quantity_available) <= 0) {
      newErrors.quantity_available = 'Quantity must be greater than 0';
    }
    
    if (!formData.prepared_date) {
      newErrors.prepared_date = 'Prepared date is required';
    }
    
    if (!formData.prepared_time) {
      newErrors.prepared_time = 'Prepared time is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      let imageUrl = formData.image_url;
      
      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Create foodData without image_url, then add it conditionally
      const { image_url, ...foodDataWithoutImage } = formData;
      const foodData = {
        ...foodDataWithoutImage,
        ...(imageUrl && { image_url: imageUrl }) // Only include image_url if it has a value
      };

      const response = await api.put(`/food/${id}`, foodData);
      
      if (response.data.message === 'Food item updated successfully') {
        navigate('/my-foods');
      }
    } catch (error) {
      console.error('Update food error:', error);
      if (error.response?.data?.details) {
        const apiErrors = {};
        error.response.data.details.forEach(detail => {
          apiErrors[detail.path] = detail.msg;
        });
        setErrors(apiErrors);
      } else {
        setErrors({ general: error.response?.data?.error || 'Failed to update food item' });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="add-food-container">
        <div className="loading">Loading food item...</div>
      </div>
    );
  }

  return (
    <div className="add-food-container">
      <div className="add-food-card">
        <div className="add-food-header">
          <h1>Edit Food Item</h1>
          <p>Update your food item details</p>
        </div>

        <form onSubmit={handleSubmit} className="add-food-form">
          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}

          <div className="form-group">
            <label htmlFor="food_type">Food Type *</label>
            <select
              id="food_type"
              name="food_type"
              value={formData.food_type}
              onChange={handleChange}
              className={errors.food_type ? 'error' : ''}
            >
              <option value="">Select food type</option>
              {foodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.food_type && (
              <span className="field-error">{errors.food_type}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="food_name">Food Name *</label>
            <input
              type="text"
              id="food_name"
              name="food_name"
              value={formData.food_name}
              onChange={handleChange}
              placeholder="e.g., Chocolate Chip Cookies, Apple Pie, etc."
              className={errors.food_name ? 'error' : ''}
            />
            {errors.food_name && (
              <span className="field-error">{errors.food_name}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity_available">Quantity Available *</label>
              <input
                type="number"
                id="quantity_available"
                name="quantity_available"
                value={formData.quantity_available}
                onChange={handleChange}
                placeholder="Enter quantity"
                min="0.01"
                step="0.01"
                className={errors.quantity_available ? 'error' : ''}
              />
              {errors.quantity_available && (
                <span className="field-error">{errors.quantity_available}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="quantity_unit">Unit *</label>
              <select
                id="quantity_unit"
                name="quantity_unit"
                value={formData.quantity_unit}
                onChange={handleChange}
              >
                <option value="count">Count</option>
                <option value="grams">Grams</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="prepared_date">Prepared Date *</label>
              <input
                type="date"
                id="prepared_date"
                name="prepared_date"
                value={formData.prepared_date}
                onChange={handleChange}
                className={errors.prepared_date ? 'error' : ''}
              />
              {errors.prepared_date && (
                <span className="field-error">{errors.prepared_date}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="prepared_time">Prepared Time *</label>
              <input
                type="time"
                id="prepared_time"
                name="prepared_time"
                value={formData.prepared_time}
                onChange={handleChange}
                className={errors.prepared_time ? 'error' : ''}
              />
              {errors.prepared_time && (
                <span className="field-error">{errors.prepared_time}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your food item (optional)"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Image (Optional)</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-btn"
              onClick={() => navigate('/my-foods')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-btn"
              disabled={saving}
            >
              {saving ? 'Updating...' : 'Update Food'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFood; 