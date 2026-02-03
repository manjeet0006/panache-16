import axios from "axios";

const API = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:3001") + "/api",
});

// 🔐 Attach ADMIN token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("panache_admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ❌ DO NOT AUTO-LOGOUT ON 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Let components decide what to do
    return Promise.reject(error);
  }
);

export default API;
