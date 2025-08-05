import api from './api';

export const getBeverages = async () => {
  const { data } = await api.get('/Beverages');
  return data;
};

export const getBeverage = (id) => api.get(`/Beverages/${id}`);
export const createBeverage = (beverage) => api.post('/Beverages', beverage);
export const updateBeverage = (id, beverage) => api.put(`/Beverages/${id}`, beverage);
export const deleteBeverage = (id) => api.delete(`/Beverages/${id}`);
