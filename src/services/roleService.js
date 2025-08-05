import api from './api';

export const listRoles = () => api.get('/Roles').then((res) => res.data);

export const getRole = (id) => api.get(`/Roles/${id}`).then((res) => res.data);

export const createRole = (data) => api.post('/Roles', data);

export const updateRole = (id, data) => api.put(`/Roles/${id}`, data);

export const deleteRole = (id) => api.delete(`/Roles/${id}`);

export const getRolePermissions = (roleId) =>
  api.get(`/Roles/${roleId}/permissions`).then((res) => res.data);

export const updateRolePermissions = (roleId, permissions) =>
  api.post(`/Roles/${roleId}/permissions`, permissions);
