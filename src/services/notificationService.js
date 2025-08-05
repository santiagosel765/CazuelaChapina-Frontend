import api from './api';

export const registerDeviceToken = (token) =>
  api.post('/Notifications/register', { token });

export const notifyCookingComplete = () =>
  api.post('/Notifications/cooking-complete');
