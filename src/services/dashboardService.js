import api from './api';

export const getDashboardSummary = async (startDate, endDate, branchId) => {
  const params = new URLSearchParams();

  const appendDate = (key, value) => {
    if (!value) return;
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) {
      params.append(key, date.toISOString());
    }
  };

  appendDate('startDate', startDate);
  appendDate('endDate', endDate);

  if (branchId) params.append('branchId', branchId);

  const { data } = await api.get(`/dashboard/summary?${params.toString()}`);
  return data;
};