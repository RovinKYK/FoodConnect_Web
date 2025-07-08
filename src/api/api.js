import axios from 'axios';

// Use Choreo managed auth: all API calls go through /choreo-apis/
const API_BASE_URL = '/choreo-apis';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// No auth token or manual 401 handling needed

export default api; 