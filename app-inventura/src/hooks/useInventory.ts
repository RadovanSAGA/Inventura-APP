import { useCallback, useState, useEffect } from 'react';
import type { InventoryItem } from '../types';
import { getItems, createItem, updateItem as apiUpdateItem, deleteItem as apiDeleteItem, deleteAllItems } from '../services/items';

type InventoryType = 'daily' | 'weekly' | 'monthly';

export function useInventory(inventoryType: InventoryType) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const valuesKey = `inventory-values-${inventoryType}`;

  // Načítaj hodnoty z localStorage
  const getLocalValues = (): Record<string, { hodnota1: number; hodnota2: number; hodnota3: number; poznamka: string; locked: boolean }> => {
    try {
      const saved = localStorage.getItem(valuesKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  // Ulož hodnoty do localStorage
  const saveLocalValues = (items: InventoryItem[]) => {
    const values: Record<string, any> = {};
    items.forEach(item => {
      values[item.id] = {
        hodnota1: item.hodnota1,
        hodnota2: item.hodnota2,
        hodnota3: item.hodnota3,
        poznamka: item.poznamka,
        locked: item.locked
      };
    });
    localStorage.setItem(valuesKey, JSON.stringify(values));
  };

  // Načítaj položky z MongoDB
  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiItems = await getItems(inventoryType);
      const localValues = getLocalValues();

      // Spoj položky z API s lokálnymi hodnotami
      const mergedItems: InventoryItem[] = apiItems.map(item => ({
        id: item._id!,
        cisloPolozky: item.cisloPolozky,
        popis: item.popis,
        baliacaJednotka: item.baliacaJednotka,
        castkovaJedno: item.castkovaJedno,
        jednotka: item.jednotka,
        stav: item.stav,
        hodnota1: localValues[item._id!]?.hodnota1 || 0,
        hodnota2: localValues[item._id!]?.hodnota2 || 0,
        hodnota3: localValues[item._id!]?.hodnota3 || 0,
        celkom: (localValues[item._id!]?.hodnota1 || 0) + 
                (localValues[item._id!]?.hodnota2 || 0) + 
                (localValues[item._id!]?.hodnota3 || 0),
        poznamka: localValues[item._id!]?.poznamka || '',
        locked: localValues[item._id!]?.locked || false
      }));

      setItems(mergedItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Chyba pri načítaní');
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Načítaj pri štarte
  useEffect(() => {
    loadItems();
  }, [inventoryType]);

  // Ulož hodnoty do localStorage pri zmene
  useEffect(() => {
    if (items.length > 0) {
      saveLocalValues(items);
    }
  }, [items]);

  // Aktualizuj hodnoty (lokálne)
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

  // Toggle lock (lokálne)
  const toggleLock = useCallback((id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, locked: !item.locked } : item
      )
    );
  }, []);

  // ➕ Pridať položku (do MongoDB - admin only)
  const addItem = useCallback(async (newItem: Omit<InventoryItem, 'id' | 'hodnota1' | 'hodnota2' | 'hodnota3' | 'celkom' | 'poznamka' | 'locked'>) => {
    try {
      const created = await createItem({
        ...newItem,
        inventoryType
      });
      
      // Pridaj do lokálneho stavu
      setItems(prev => [...prev, {
        id: created._id!,
        cisloPolozky: created.cisloPolozky,
        popis: created.popis,
        baliacaJednotka: created.baliacaJednotka,
        castkovaJedno: created.castkovaJedno,
        jednotka: created.jednotka,
        stav: created.stav,
        hodnota1: 0,
        hodnota2: 0,
        hodnota3: 0,
        celkom: 0,
        poznamka: '',
        locked: false
      }]);
    } catch (err) {
      console.error('Error adding item:', err);
      alert(err instanceof Error ? err.message : 'Chyba pri pridávaní položky');
    }
  }, [inventoryType]);

  // ✏️ Upraviť položku (v MongoDB - admin only)
  const editItem = useCallback(async (id: string, updates: Partial<InventoryItem>) => {
    try {
      await apiUpdateItem(id, updates);
      
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      );
    } catch (err) {
      console.error('Error editing item:', err);
      alert(err instanceof Error ? err.message : 'Chyba pri úprave položky');
    }
  }, []);

  // 🗑️ Vymazať položku (z MongoDB - admin only)
  const deleteItem = useCallback(async (id: string) => {
    try {
      await apiDeleteItem(id);
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
      alert(err instanceof Error ? err.message : 'Chyba pri mazaní položky');
    }
  }, []);

  // 🗑️ Vymazať všetky položky (z MongoDB - admin only)
  const deleteAll = useCallback(async () => {
    try {
      await deleteAllItems(inventoryType);
      setItems([]);
      localStorage.removeItem(valuesKey);
    } catch (err) {
      console.error('Error deleting all items:', err);
      alert(err instanceof Error ? err.message : 'Chyba pri mazaní položiek');
    }
  }, [inventoryType, valuesKey]);

  // Reset hodnôt (len lokálne)
  const resetAll = useCallback(() => {
    if (window.confirm('Naozaj chcete resetovať všetky hodnoty?')) {
      setItems(prevItems =>
        prevItems.map(item => ({
          ...item,
          hodnota1: 0,
          hodnota2: 0,
          hodnota3: 0,
          celkom: 0,
          poznamka: '',
          locked: false
        }))
      );
      localStorage.removeItem(valuesKey);
    }
  }, [valuesKey]);

  // Export CSV
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
    link.setAttribute('download', `inventura_${inventoryType}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [items, inventoryType]);

  return {
    items,
    loading,
    error,
    updateItem,
    toggleLock,
    addItem,
    editItem,
    deleteItem,
    deleteAll,
    resetAll,
    exportToCSV,
    reload: loadItems
  };
}
