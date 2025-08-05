import api from './api';

export const listModules = () => api.get('/Modules').then((res) => res.data);

export const getModule = (id) => api.get(`/Modules/${id}`).then((res) => res.data);

export const createModule = (data) => api.post('/Modules', data);

export const updateModule = (id, data) => api.put(`/Modules/${id}`, data);

export const deleteModule = (id) => api.delete(`/Modules/${id}`);
