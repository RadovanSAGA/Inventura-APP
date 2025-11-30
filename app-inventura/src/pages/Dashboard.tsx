import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { inventoryService } from '../services/inventory';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { InventoryTable } from '../components/InventoryTable';
import { useInventory } from '../hooks/useInventory';
import './Dashboard.css';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const {
    items,
    updateItem,
    toggleLock,
    resetAll,
    exportToCSV
  } = useInventory();

  // Automatické uloženie do backendu
  const syncToBackend = async () => {
    try {
      setSyncing(true);
      const currentDate = new Date().toISOString().split('T')[0];
      
      await inventoryService.create({
        date: currentDate,
        items: items,
        status: 'draft'
      });
      
      setLastSync(new Date());
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  };

  const lockedCount = items.filter(item => item.locked).length;

  return (
    <div className="dashboard">
      <Header />
      
      <div className="dashboard-topbar">
        <div className="user-info">
          <span>👤 {user?.username}</span>
          <span className="sync-status">
            {syncing ? '🔄 Synchronizujem...' : lastSync ? `✓ Uložené ${lastSync.toLocaleTimeString()}` : ''}
          </span>
        </div>
        <div className="actions">
          <button onClick={syncToBackend} disabled={syncing} className="btn-sync">
            💾 Uložiť
          </button>
          <button onClick={logout} className="btn-logout">
            🚪 Odhlásiť
          </button>
        </div>
      </div>

      <div className="container">
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onExport={exportToCSV}
          onReset={resetAll}
          totalItems={items.length}
          lockedCount={lockedCount}
        />

        <InventoryTable
          items={items}
          searchTerm={searchTerm}
          onUpdate={updateItem}
          onToggleLock={toggleLock}
        />
      </div>
    </div>
  );
}