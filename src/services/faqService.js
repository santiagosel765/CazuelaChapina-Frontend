import api from './api';

export const getFaqAnswer = (question) =>
  api.get('/Faq', { params: { question } }).then((res) => res.data);

