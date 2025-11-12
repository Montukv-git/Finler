import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const API_KEY = import.meta.env.VITE_INVEST_API_KEY || 'DEMO_KEY_123';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'X-API-Key': API_KEY }
});

export async function computePlan(payload: any) {
  const { data } = await api.post('/api/compute-plan', payload);
  return data;
}

export async function getCatalog() {
  const { data } = await api.get('/api/catalog');
  return data.items;
}
