import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for adding token
api.interceptors.request.use(
  (config) => {
    // Obtain token
    const token = useAuthStore.getState().token || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for error managing
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 -> log out
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }

    // Normalize error
    const message =
      error.response?.data?.error ||
      error.response?.data?.data?.originalMessage

    return Promise.reject({ ...error, message });
  }
);

export default api;
