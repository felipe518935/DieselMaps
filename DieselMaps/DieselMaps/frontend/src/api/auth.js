import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
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
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
};

export const stationsAPI = {
  getNearby: (lat, lng, radius = 5) =>
    API.get(`/stations/public/nearby?lat=${lat}&lng=${lng}&radiusKm=${radius}`),
  getById: (id) => API.get(`/stations/${id}`),
  create: (data) => API.post('/stations', data),
  updatePrice: (id, data) => API.patch(`/stations/${id}/prices`, data),
};

export default API;
