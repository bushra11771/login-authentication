import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('authData');
  let token = null;
  if (authData) {
    try {
      token = JSON.parse(authData).token;
    } catch (e) {
      token = null;
    }
  }
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;