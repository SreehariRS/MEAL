import axios from 'axios';

// Prefer an explicit backend base URL in production via VITE_API_URL.
// If not provided, fall back to same-origin (useful for local dev proxying).
const configuredBase = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '')
  : '';

export const api = axios.create({
  baseURL: `${configuredBase}/api`,
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


