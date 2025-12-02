import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { InventoryItem } from '../types';
import { initialInventoryData } from '../data/inventoryData';

export function useInventory() {
  const [items, setItems] = useLocalStorage<InventoryItem[]>(
    'inventory-items',
    initialInventoryData.map((item, index) => ({
      ...item,
      id: `item-${index}`,
      locked: false,
      celkom: 0,
      hodnota1: 0,
      hodnota2: 0,
      hodnota3: 0,
      poznamka: ''
    }))
  );

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
  }, [setItems]);

  const toggleLock = useCallback((id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, locked: !item.locked } : item
      )
    );
  }, [setItems]);

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
      // Vymaž aj localStorage
      localStorage.removeItem('inventory-items');
    }
  }, [setItems]);

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