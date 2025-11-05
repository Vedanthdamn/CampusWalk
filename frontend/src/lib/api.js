import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hostels
export const getHostels = async () => {
  const response = await api.get('/hostels');
  return response.data;
};

// Buildings
export const getBuildings = async () => {
  const response = await api.get('/buildings');
  return response.data;
};

// Navigation
export const getNavigation = async (fromNodeId, toNodeId) => {
  const response = await api.get('/navigation', {
    params: { from: fromNodeId, to: toNodeId },
  });
  return response.data;
};

// Auth
export const login = async (token) => {
  const response = await api.post('/auth/login', { token });
  return response.data;
};

export default api;
