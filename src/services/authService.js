import api from './api';

export const loginRequest = (credentials) => api.post('/Auth/login', credentials);
export const registerRequest = (payload) => api.post('/Auth/register', payload);
export const logoutRequest = () => Promise.resolve();
