import api from './api';

export const getInventoryItems = async () => {
  const { data } = await api.get('/Inventory');
  return data;
};

export const getRecentInventoryEntries = async () => {
  const { data } = await api.get('/Inventory/entries/recent');
  return data;
};

export const createInventoryItem = (item) =>
  api.post('/Inventory', { ...item, type: 1 });

export const updateInventoryItem = (id, item) =>
  api.put(`/Inventory/${id}`, { ...item, type: 1 });

export const registerInventoryEntry = (id, payload) =>
  api.post(`/Inventory/${id}/entry`, payload);
export const registerInventoryExit = (id, payload) =>
  api.post(`/Inventory/${id}/exit`, payload);
export const registerInventoryWaste = (id, payload) =>
  api.post(`/Inventory/${id}/waste`, payload);
