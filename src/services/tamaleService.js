import api from './api';

export const getTamales = async () => {
  const { data } = await api.get('/Tamales');
  return data;
};

export const getTamale = (id) => api.get(`/Tamales/${id}`);
export const createTamale = (tamale) => api.post('/Tamales', tamale);
export const updateTamale = (id, tamale) => api.put(`/Tamales/${id}`, tamale);
export const deleteTamale = (id) => api.delete(`/Tamales/${id}`);
