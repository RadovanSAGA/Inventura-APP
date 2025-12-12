import { useState } from 'react';
import { InventoryTable } from './InventoryTable';
import { FilterBar } from './FilterBar';
import { useInventory } from '../hooks/useInventory';
import './InventoryPage.css';

interface WeeklyInventoryProps {
  onBack: () => void;
}

export function WeeklyInventory({ onBack }: WeeklyInventoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  
  const {
    items,
    updateItem,
    toggleLock,
    resetAll,
    exportToCSV
  } = useInventory('weekly');

  const lockedCount = items.filter(item => item.locked).length;

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <button onClick={onBack} className="btn-back">← Späť</button>
        <h2>📊 Týždenná inventúra</h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-input"
        />
      </div>

      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onExport={exportToCSV}
        onReset={resetAll}
        totalItems={items.length}
        lockedCount={lockedCount}
        items={items}
        selectedDate={selectedDate}
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