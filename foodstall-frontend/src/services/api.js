import axios from 'axios';

/**
 * Base API URL configurable via Vite environment variables (.env)
 * Defaults to http://localhost:5000/api in local development.
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create configured axios client instance with request timeout
const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

// Add token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ===== AUTH =====

export const authAPI = {
  register: (mobile, name, password) =>
    apiClient.post('/auth/register', { mobile, name, password }),
  login: (mobile, password) =>
    apiClient.post('/auth/login', { mobile, password }),
  getMe: () => apiClient.get('/auth/me'),
};

// ===== STALLS =====

export const stallAPI = {
  getBySlug: (slug) =>
    apiClient.get(`/stalls/slug/${slug}`),
  getById: (stallId) =>
    apiClient.get(`/stalls/${stallId}`),
};

// ===== CATEGORIES =====

export const categoryAPI = {
  getByStall: (stallId) =>
    apiClient.get(`/stalls/${stallId}/categories`),
};

// ===== PRODUCTS =====

export const productAPI = {
  getByStall: (stallId, categoryId = null) => {
    const url = categoryId
      ? `/stalls/${stallId}/products?categoryId=${categoryId}`
      : `/stalls/${stallId}/products`;
    return apiClient.get(url);
  },
  getById: (stallId, productId) =>
    apiClient.get(`/stalls/${stallId}/products/${productId}`),
};

export default apiClient;