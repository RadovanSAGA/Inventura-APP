import { useState } from 'react';
import { InventoryTable } from './InventoryTable';
import { FilterBar } from './FilterBar';
import { useInventory } from '../hooks/useInventory';
import './InventoryPage.css';

interface MonthlyInventoryProps {
  onBack: () => void;
}

export function MonthlyInventory({ onBack }: MonthlyInventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    items,
    updateItem,
    toggleLock,
    resetAll,
    exportToCSV
  } = useInventory('monthly'); // 'monthly' storage key

  const lockedCount = items.filter(item => item.locked).length;

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <button onClick={onBack} className="btn-back">← Späť</button>
        <h2>📈 Mesačná inventúra</h2>
        <div className="inventory-date">
          {new Date().toLocaleDateString('sk-SK', { 
            year: 'numeric', 
            month: 'long'
          })}
        </div>
      </div>

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onExport={exportToCSV}
        onReset={resetAll}
        totalItems={items.length}
        lockedCount={lockedCount}
        items={items}
      />

      <InventoryTable
        items={items}
        searchTerm={searchTerm}
        onUpdate={updateItem}
        onToggleLock={toggleLock}
      />
    </div>
  );
}