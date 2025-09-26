import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
});

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common.Authorization;
    localStorage.removeItem('token');
  }
}

const existing = localStorage.getItem('token');
if (existing) setAuthToken(existing);


