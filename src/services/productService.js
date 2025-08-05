import api from './api';

// Product endpoints are not present in the current backend API definition.
// These helpers remain as placeholders for potential future implementation.
export async function getProducts() {
  const { data } = await api.get('/Products');
  return data;
}

export const getProduct = (id) => api.get(`/Products/${id}`);
export const createProduct = (product) => api.post('/Products', product);
export const updateProduct = (id, product) => api.put(`/Products/${id}`, product);
export const deleteProduct = (id) => api.delete(`/Products/${id}`);
