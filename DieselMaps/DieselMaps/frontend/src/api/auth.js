import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('dieselmaps_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('dieselmaps_token');
      localStorage.removeItem('dieselmaps_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: (payload) => API.post('/auth/login', payload),
  register: (payload) => API.post('/auth/register', payload),
};

export const stationsAPI = {
  getNearby: (lat, lng, radius = 8) =>
    API.get(`/stations/public/nearby?lat=${lat}&lng=${lng}&radiusKm=${radius}`),
  getById: (id) => API.get(`/stations/${id}`),
  create: (payload) => API.post('/stations', payload),
  updatePrice: (id, payload) => API.patch(`/stations/${id}/prices`, payload),
  getHistory: (id) => API.get(`/stations/${id}/history`),
};

export const usersAPI = {
  toggleFavorite: (stationId) => API.post(`/users/favorites/${stationId}`),
  getFavorites: () => API.get('/users/favorites'),
  getAlerts: () => API.get('/users/alerts'),
  markAlertAsRead: (alertId) => API.put(`/users/alerts/${alertId}/read`),
};

export default API;
