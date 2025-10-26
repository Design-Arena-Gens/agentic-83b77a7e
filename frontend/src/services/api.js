import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
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

// Auth API
export const login = (credentials) => api.post('/auth/login', credentials);
export const signup = (userData) => api.post('/auth/signup', userData);

// Cake API
export const getAllCakes = () => api.get('/cakes');
export const getCakeById = (id) => api.get(`/cakes/${id}`);
export const getCakesByFlavor = (flavor) => api.get(`/cakes/flavor/${flavor}`);
export const getCakesByOccasion = (occasion) => api.get(`/cakes/occasion/${occasion}`);
export const searchCakes = (keyword) => api.get(`/cakes/search?keyword=${keyword}`);

// Order API
export const createOrder = (orderData) => api.post('/orders', orderData);
export const getUserOrders = () => api.get('/orders/user');
export const getOrderById = (id) => api.get(`/orders/${id}`);

// Review API
export const createReview = (reviewData) => api.post('/reviews', reviewData);
export const getReviewsByCakeId = (cakeId) => api.get(`/reviews/cake/${cakeId}`);

// Admin API
export const createCake = (cakeData) => api.post('/admin/cakes', cakeData);
export const updateCake = (id, cakeData) => api.put(`/admin/cakes/${id}`, cakeData);
export const deleteCake = (id) => api.delete(`/admin/cakes/${id}`);
export const uploadFile = (formData) => {
  return api.post('/admin/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const getAllOrders = () => api.get('/admin/orders');
export const updateOrderStatus = (id, status) => api.put(`/admin/orders/${id}/status?status=${status}`);
export const getDashboardStats = () => api.get('/admin/dashboard');

export default api;
