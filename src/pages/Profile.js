import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import './Profile.css';

const Profile = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    phone_number: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const { user, loading: authLoading, updateProfileComplete, setFullUserData } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Load existing profile data if available
      const loadProfileData = async () => {
        try {
          const response = await api.get('/user/profile');
          const userProfile = response.data.user;
          setFormData({
            first_name: userProfile.first_name || user.given_name || '',
            last_name: userProfile.last_name || user.family_name || '',
            address: userProfile.address || '',
            phone_number: userProfile.phone_number || ''
          });
        } catch (error) {
          console.error('Load profile error:', error);
          // Fallback to basic user data
          setFormData({
            first_name: user.given_name || '',
            last_name: user.family_name || '',
            address: '',
            phone_number: ''
          });
        }
      };
      
      loadProfileData();
    }
  }, [user]);

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.phone_number.trim()) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^\d+$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Phone number must contain only numbers';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/user/profile', formData);
      
      if (response.data.message === 'Profile updated successfully') {
        updateProfileComplete(true);
        setSuccess(true);
        
        // Update the user data in AuthContext with the new profile data
        setFullUserData({
          ...user,
          ...formData
        });
        
        // Only redirect to home if this was a new user completing their profile
        // For existing users editing profile, stay on the page
        if (!user.first_name && !user.last_name) {
          setTimeout(() => navigate('/'), 2000);
        }
      }
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.response?.data?.details) {
        const apiErrors = {};
        error.response.data.details.forEach(detail => {
          apiErrors[detail.path] = detail.msg;
        });
        setErrors(apiErrors);
      } else {
        setErrors({ general: error.response?.data?.error || 'Failed to update profile' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Profile Information</h1>
          <p>Update your personal information</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {success && (
            <div className="success-message">Profile updated successfully!</div>
          )}
          {errors.general && (
            <div className="error-message">{errors.general}</div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first_name">First Name *</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Enter your first name"
                className={errors.first_name ? 'error' : ''}
              />
              {errors.first_name && (
                <span className="field-error">{errors.first_name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="last_name">Last Name *</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Enter your last name"
                className={errors.last_name ? 'error' : ''}
              />
              {errors.last_name && (
                <span className="field-error">{errors.last_name}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Address *</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your full address"
              rows="3"
              className={errors.address ? 'error' : ''}
            />
            {errors.address && (
              <span className="field-error">{errors.address}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="phone_number">Phone Number *</label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Enter your phone number (numbers only)"
              className={errors.phone_number ? 'error' : ''}
            />
            {errors.phone_number && (
              <span className="field-error">{errors.phone_number}</span>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="save-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile; 