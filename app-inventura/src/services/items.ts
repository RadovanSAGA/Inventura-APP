const API_URL = import.meta.env.VITE_API_URL || 'https://inventura-server.vercel.app';

export interface ItemData {
  _id?: string;
  cisloPolozky: string;
  popis: string;
  baliacaJednotka: string;
  castkovaJedno: string;
  jednotka: string;
  stav: string;
  inventoryType: 'daily' | 'weekly' | 'monthly';
}

// Získaj token z localStorage
const getToken = () => localStorage.getItem('token');

// Získaj všetky položky podľa typu
export const getItems = async (type: 'daily' | 'weekly' | 'monthly'): Promise<ItemData[]> => {
  const response = await fetch(`${API_URL}/api/items?type=${type}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Chyba pri načítaní položiek');
  }
  
  return data.data;
};

// Pridaj novú položku (admin only)
export const createItem = async (item: Omit<ItemData, '_id'>): Promise<ItemData> => {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/api/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(item)
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Chyba pri vytváraní položky');
  }
  
  return data.data;
};

// Uprav položku (admin only)
export const updateItem = async (id: string, updates: Partial<ItemData>): Promise<ItemData> => {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/api/items/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updates)
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Chyba pri úprave položky');
  }
  
  return data.data;
};

// Vymaž položku (admin only)
export const deleteItem = async (id: string): Promise<void> => {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/api/items/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Chyba pri mazaní položky');
  }
};

// Vymaž všetky položky podľa typu (admin only)
export const deleteAllItems = async (type: 'daily' | 'weekly' | 'monthly'): Promise<void> => {
  const token = getToken();
  
  const response = await fetch(`${API_URL}/api/items/all/${type}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.message || 'Chyba pri mazaní položiek');
  }
};