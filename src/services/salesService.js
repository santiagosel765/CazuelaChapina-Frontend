import api from './api';

export const getSales = async () => {
  const { data } = await api.get('/Sales');
  return data;
};

export const createSale = (sale) => api.post('/Sales', sale);
export const syncSale = (sale) => api.post('/Sync/sale', sale);
export const getSaleById = (id) => api.get(`/Sales/${id}`);
