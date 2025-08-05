import api from './api';

export const getCombos = async () => {
  const { data } = await api.get('/Combos');
  return data;
};

export const getCombo = (id) => api.get(`/Combos/${id}`);
export const createCombo = (combo) => api.post('/Combos', combo);
export const updateCombo = (id, combo) => api.put(`/Combos/${id}`, combo);
export const deleteCombo = (id) => api.delete(`/Combos/${id}`);
export const cloneCombo = (id) => api.post(`/Combos/${id}/clone`);
export const activateCombo = (id) => api.post(`/Combos/${id}/activate`);
export const deactivateCombo = (id) => api.post(`/Combos/${id}/deactivate`);
