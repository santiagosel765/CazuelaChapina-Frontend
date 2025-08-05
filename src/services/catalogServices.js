import api from './api';

const createService = (baseUrl) => ({
  list: async () => {
    const { data } = await api.get(baseUrl);
    return data;
  },
  get: async (id) => {
    const { data } = await api.get(`${baseUrl}/${id}`);
    return data;
  },
  create: (payload) => api.post(baseUrl, payload),
  update: (id, payload) => api.put(`${baseUrl}/${id}`, payload),
  remove: (id) => api.delete(`${baseUrl}/${id}`),
});

export const tamaleTypeService = createService('/TamaleTypes');
export const fillingService = createService('/Fillings');
export const wrapperService = createService('/Wrappers');
export const spiceLevelService = createService('/SpiceLevels');

export const beverageTypeService = createService('/BeverageTypes');
export const beverageSizeService = createService('/BeverageSizes');
export const sweetenerService = createService('/Sweeteners');
export const toppingService = createService('/Toppings');

export default {
  tamaleTypeService,
  fillingService,
  wrapperService,
  spiceLevelService,
  beverageTypeService,
  beverageSizeService,
  sweetenerService,
  toppingService,
};
