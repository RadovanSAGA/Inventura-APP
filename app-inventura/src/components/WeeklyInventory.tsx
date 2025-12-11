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
  const {
    items,
    updateItem,
    toggleLock,
    resetAll,
    exportToCSV
  } = useInventory('weekly'); // 'weekly' storage key

  const lockedCount = items.filter(item => item.locked).length;

  // Zistiť číslo týždňa
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const weekNumber = getWeekNumber(new Date());

  return (
    <div className="inventory-page">
      <div className="inventory-header">
        <button onClick={onBack} className="btn-back">← Späť</button>
        <h2>📊 Týždenná inventúra</h2>
        <div className="inventory-date">
          Týždeň {weekNumber} • {new Date().getFullYear()}
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