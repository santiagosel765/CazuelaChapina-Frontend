import api from './api';

export const listUsers = (params) =>
  api.get('/Users', { params }).then((res) => res.data);

export const getUser = (id) =>
  api.get(`/Users/${id}`).then((res) => res.data);

export const createUser = (data) => api.post('/Users', data);

export const updateUser = (id, data) => api.put(`/Users/${id}`, data);

export const deleteUser = (id) => api.delete(`/Users/${id}`);

export const changeUserStatus = (id, status) =>
  api.put(`/Users/${id}/status`, { status });

export const assignUserRole = (userId, roleId) =>
  api.put(`/Users/${userId}/roles`, { roleId });
