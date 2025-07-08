import axios from 'axios';
import config from '../config.json';

// Create axios instance with base configuration
const API_BASE_URL = config.API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  signup: (data) => api.post('/auth/signup', data),
  getUser: () => api.get('/auth/user'),
};

// User API
export const userAPI = {
  updateProfile: (data) => api.post('/user/profile', data),
  getProfile: () => api.get('/user/profile'),
};

// Food API
export const foodAPI = {
  createFood: (data) => api.post('/food', data),
  getAllFoods: (params = {}) => api.get('/food', { params }),
  getFoodById: (id) => api.get(`/food/${id}`),
  getMyFoods: () => api.get('/food/myfoods'),
  updateFood: (id, data) => api.put(`/food/${id}`, data),
  deleteFood: (id) => api.delete(`/food/${id}`),
  requestFood: (id, data) => api.post(`/food/${id}/request`, data),
};

// Notifications API
export const notificationAPI = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Health check
export const healthAPI = {
  checkHealth: () => api.get('/health'),
};

export default api; 