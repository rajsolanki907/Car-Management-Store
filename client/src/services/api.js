import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

export const carService = {
  getAll: () => api.get('/cars'),
  getById: (id) => api.get(`/cars/${id}`),
  create: (data) => api.post('/cars', data),
  update: (id, data) => api.put(`/cars/${id}`, data),
  delete: (id) => api.delete(`/cars/${id}`),
  search: (query) => api.get(`/cars/search?q=${query}`)
};

export const userService = {
  updateSettings: (data) => api.put('/users/settings', data),
  getFavorites: () => api.get('/users/favorites'),
  addFavorite: (carId) => api.post(`/users/favorites/${carId}`),
  removeFavorite: (carId) => api.delete(`/users/favorites/${carId}`)
};