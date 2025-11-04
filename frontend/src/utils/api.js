import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const buildingService = {
  getAll: () => api.get('/buildings'),
  getById: (id) => api.get(`/buildings/${id}`),
};

export const floorService = {
  getAll: () => api.get('/floors'),
  getById: (id) => api.get(`/floors/${id}`),
  getByBuilding: (buildingId) => api.get(`/floors/building/${buildingId}`),
};

export const locationService = {
  getAll: () => api.get('/locations'),
  getById: (id) => api.get(`/locations/${id}`),
  getByFloor: (floorId) => api.get(`/locations/floor/${floorId}`),
  search: (query) => api.get(`/locations/search?query=${query}`),
  getByType: (type) => api.get(`/locations/type/${type}`),
};

export const navigationService = {
  findRoute: (fromId, toId) => api.get(`/navigation/route?from=${fromId}&to=${toId}`),
};

export default api;
