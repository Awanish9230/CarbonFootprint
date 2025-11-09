// frontend/src/api/insights.js
import api from './axios';

export const getForecast = () => api.get('/insights/forecast').then(r => r.data);
export const getReductionPlan = () => api.get('/insights/reduction-plan').then(r => r.data);
export const getBenchmark = () => api.get('/insights/benchmark').then(r => r.data);
export const askAssistant = (question) => api.post('/insights/assistant', { question }).then(r => r.data);
