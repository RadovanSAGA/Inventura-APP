import { api } from './api';
import type { InventoryItem } from '../types';

export interface InventoryData {
  date: string;
  items: InventoryItem[];
  status?: 'draft' | 'completed' | 'archived';
}

export const inventoryService = {
  async getAll() {
    const response = await api.get('/inventory');
    return response.data;
  },

  async getById(id: string) {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },

  async create(data: InventoryData) {
    const response = await api.post('/inventory', data);
    return response.data;
  },

  async update(id: string, data: Partial<InventoryData>) {
    const response = await api.put(`/inventory/${id}`, data);
    return response.data;
  },

  async delete(id: string) {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  }
};