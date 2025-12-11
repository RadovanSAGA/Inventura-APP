import { useState } from 'react';
import { InventoryTable } from './InventoryTable';
import { FilterBar } from './FilterBar';
import { useInventory } from '../hooks/useInventory';
import './InventoryPage.css';

interface DailyInventoryProps {
  onBack: () => void;
}

export function DailyInventory({ onBack }: DailyInventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const {
    items,
    updateItem,
    toggleLock,
    resetAll,
    exportToCSV
  } = useInventory('daily'); // 'daily' storage key

  const lockedCount = items.filter(item => item.locked).length;

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <button onClick={onBack} className="btn-back">← Späť</button>
        <h2>📅 Denná inventúra</h2>
        <div className="inventory-date">
          {new Date().toLocaleDateString('sk-SK', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
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