import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (username, password) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    return api.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  requestOTP: (email) => api.post('/auth/request-otp', { email }),
  verifyOTPLogin: (email, otp_code) => api.post('/auth/verify-otp-login', { email, otp_code }),
  resetPassword: (email, otp_code, new_password) => api.post('/auth/reset-password', { email, otp_code, new_password }),
};

export const queryAPI = {
  generate: (naturalLanguage) => api.post('/query/generate', { natural_language: naturalLanguage }),
  execute: (sql) => api.post('/query/execute', { sql_query: sql }),
  getHistory: () => api.get('/query/history'),
};

export const usersAPI = {
  getUsers: () => api.get('/users/'),
  updateRole: (userId, roleName) => api.put(`/users/${userId}/role`, { role_name: roleName }),
};

export default api;
