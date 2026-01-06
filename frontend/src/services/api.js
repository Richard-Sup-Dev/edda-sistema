// src/services/api.js
import { API_ENDPOINTS } from '@/config/api';

const getToken = () => localStorage.getItem('token');

const api = {
  // AUTH
  login: (email, senha) => 
    fetch(API_ENDPOINTS.AUTH_LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    }).then(r => r.json()),

  // USUÁRIOS (só admin)
  getUsers: () => 
    fetch(`${API_ENDPOINTS.AUTH_ME}`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json()),

  createUser: (data) => 
    fetch(`${API_ENDPOINTS.AUTH_REGISTER}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  updateUser: (id, data) => 
    fetch(`${API_ENDPOINTS.AUTH_ME}/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  deleteUser: (id) => 
    fetch(`${API_ENDPOINTS.AUTH_ME}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${getToken()}` }
    }).then(r => r.json()),

  resetPassword: (id, senha) => 
    fetch(`${API_ENDPOINTS.AUTH_ME}/${id}/reset-password`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({ senha })
    }).then(r => r.json())
};

export default api;