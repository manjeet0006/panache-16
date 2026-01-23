import axios from 'axios';

const API = axios.create({
  // Use the environment variable defined in your .env file
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

// Optional: Add interceptors for token handling if needed
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;
