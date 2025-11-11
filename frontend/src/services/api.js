import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

// Watchlist API
export const watchlistApi = {
  getAll: () => axios.get(`${API_URL}/watchlist`),
  add: (data) => axios.post(`${API_URL}/watchlist`, data),
  update: (id, data) => axios.put(`${API_URL}/watchlist/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/watchlist/${id}`),
};

// Alerts API
export const alertsApi = {
  getAll: () => axios.get(`${API_URL}/alerts`),
  create: (data) => axios.post(`${API_URL}/alerts`, data),
  update: (id, data) => axios.put(`${API_URL}/alerts/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/alerts/${id}`),
};

// Market Data API
export const marketApi = {
  getQuote: (symbol) => axios.get(`${API_URL}/market/${symbol}`),
  getHistory: (symbol, interval = '1day', limit = 30) =>
    axios.get(`${API_URL}/market/${symbol}/history`, {
      params: { interval, limit },
    }),
  search: (query) => axios.get(`${API_URL}/market/search`, { params: { q: query } }),
  getBulk: (symbols) => axios.post(`${API_URL}/market/bulk`, { symbols }),
};

export default {
  watchlist: watchlistApi,
  alerts: alertsApi,
  market: marketApi,
};
