import axios from 'axios';

const API = axios.create({
  // Use the environment variable defined in your .env file
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// Optional: Add interceptors for token handling if needed
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('panache_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
