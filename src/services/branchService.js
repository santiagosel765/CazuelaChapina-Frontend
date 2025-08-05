import api from './api';

export const getBranches = async () => {
  const { data } = await api.get('/Branches');
  return data;
};

export const createBranch = (branch) => api.post('/Branches', branch);
// Endpoint not yet available in API definitions
export const assignManager = (branchId, userId) => api.post(`/Branches/${branchId}/assign/${userId}`);
export const getBranchReport = (id) => api.get(`/Branches/${id}/report`);
