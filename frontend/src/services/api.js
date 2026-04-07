import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:6000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (username, password) => 
  api.post('/auth/login', { username, password });

export const getCurrentUser = () => 
  api.get('/auth/me');

// Branches
export const getBranches = () => 
  api.get('/branches');

export const addBranch = (data) => 
  api.post('/branches', data);

export const updateBranch = (id, data) => 
  api.put(`/branches/${id}`, data);

export const deleteBranch = (id) => 
  api.delete(`/branches/${id}`);

export const testBranch = (id) => 
  api.post(`/branches/${id}/test`);

export const getBranchHealth = (id) => 
  api.get(`/branches/${id}/health`);

// Aggregation
export const getOverview = () => 
  api.get('/aggregate/overview');

export const getAllStudents = () => 
  api.get('/aggregate/students');

export const getAllStaff = () => 
  api.get('/aggregate/staff');

export const getFinance = () => 
  api.get('/aggregate/finance');

export const getAcademics = () => 
  api.get('/aggregate/academics');

export const getAttendance = (date) => 
  api.get('/aggregate/attendance', { params: { date } });

export const getComparison = () => 
  api.get('/aggregate/comparison');

export default api;
