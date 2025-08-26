import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds auth token to requests
apiClient.interceptors.request.use(
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

// Response interceptor - handles common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  getMe: () => apiClient.get('/auth/me'),
};

// Blog API calls
export const blogAPI = {
  generate: (topic) => apiClient.post('/blog/generate', { topic }),
  getMyBlogs: (page = 1) => apiClient.get(`/blog/my-blogs?page=${page}`),
  getBlog: (id) => apiClient.get(`/blog/${id}`),
  deleteBlog: (id) => apiClient.delete(`/blog/${id}`),
};

// Admin API calls
export const adminAPI = {
  getStats: () => apiClient.get('/admin/stats'),
  getRecentGenerations: () => apiClient.get('/admin/recent-generations'),
  getUsers: (page = 1) => apiClient.get(`/admin/users?page=${page}`),
};

export default apiClient;
