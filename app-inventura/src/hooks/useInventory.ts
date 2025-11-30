import { useCallback, useState, useEffect } from 'react';
import type { InventoryItem } from '../types';
import { initialInventoryData } from '../data/inventoryData';

export function useInventory() {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('inventory-items');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    
    return initialInventoryData.map((item, index) => ({
      ...item,
      id: `item-${index}`,
      locked: false,
      celkom: 0,
      hodnota1: 0,
      hodnota2: 0,
      hodnota3: 0,
      poznamka: ''
    }));
  });

  // Auto-save do localStorage
  useEffect(() => {
    try {
      localStorage.setItem('inventory-items', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [items]);


  const updateItem = useCallback((id: string, updates: Partial<InventoryItem>) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id !== id) return item;
        
        const updatedItem = { ...item, ...updates };
        
        // Prepočítaj celkom
        if ('hodnota1' in updates || 'hodnota2' in updates || 'hodnota3' in updates) {
          updatedItem.celkom = 
            (updates.hodnota1 !== undefined ? updates.hodnota1 : item.hodnota1) +
            (updates.hodnota2 !== undefined ? updates.hodnota2 : item.hodnota2) +
            (updates.hodnota3 !== undefined ? updates.hodnota3 : item.hodnota3);
        }
        
        return updatedItem;
      })
    );
  }, []);

  const toggleLock = useCallback((id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, locked: !item.locked } : item
      )
    );
  }, []);

  const resetAll = useCallback(() => {
    if (window.confirm('Naozaj chcete resetovať všetky údaje?')) {
      const resetData = initialInventoryData.map((item, index) => ({
        ...item,
        id: `item-${index}`,
        locked: false,
        celkom: 0,
        hodnota1: 0,
        hodnota2: 0,
        hodnota3: 0,
        poznamka: ''
      }));
      setItems(resetData);
      localStorage.removeItem('inventory-items');
    }
  }, []);

  const exportToCSV = useCallback(() => {
    const header = 'Číslo položky,Popis,Baliaca jednotka,Hodnota1,Časťková jedno,Hodnota2,Jednotka,Hodnota3,Celkom,Poznámka,Uzamknuté\n';
    const rows = items.map(item =>
      `${item.cisloPolozky},${item.popis},${item.baliacaJednotka},${item.hodnota1},${item.castkovaJedno},${item.hodnota2},${item.jednotka},${item.hodnota3},${item.celkom},${item.poznamka},${item.locked ? 'Áno' : 'Nie'}`
    ).join('\n');

    const csvContent = header + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `inventura_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [items]);

  return {
    items,
    updateItem,
    toggleLock,
    resetAll,
    exportToCSV
  };
}