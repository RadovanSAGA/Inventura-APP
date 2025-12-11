import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { inventoryService } from '../services/inventory';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { InventoryTable } from '../components/InventoryTable';
import { ManageItems } from '../components/ManageItems';
import { MaterialsList } from '../components/MaterialsList';
import { DailyInventory } from '../components/DailyInventory';
import { WeeklyInventory } from '../components/WeeklyInventory';
import { MonthlyInventory } from '../components/MonthlyInventory';
import { useInventory } from '../hooks/useInventory';
import type { InventoryItem } from '../types';
import './Dashboard.css';

type Page = 'inventory' | 'manage-items' | 'materials-list' | 'daily-inventory' | 'weekly-inventory' | 'monthly-inventory';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Hlavná inventúra (default)
  const {
    items,
    updateItem,
    toggleLock,
    resetAll,
    exportToCSV,
    addItem,
    editItem,
    deleteItem
  } = useInventory();

  // Denná inventúra
  const {
    items: dailyItems,
    addItem: addDailyItem,
    editItem: editDailyItem,
    deleteItem: deleteDailyItem
  } = useInventory('daily');

  // Týždenná inventúra
  const {
    items: weeklyItems,
    addItem: addWeeklyItem,
    editItem: editWeeklyItem,
    deleteItem: deleteWeeklyItem
  } = useInventory('weekly');

  // Mesačná inventúra
  const {
    items: monthlyItems,
    addItem: addMonthlyItem,
    editItem: editMonthlyItem,
    deleteItem: deleteMonthlyItem
  } = useInventory('monthly');

  // Helper funkcia pre vytvorenie položky
  const createItem = (newItem: any): InventoryItem => {
    const id = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      id,
      ...newItem,
      hodnota1: 0,
      hodnota2: 0,
      hodnota3: 0,
      celkom: 0,
      poznamka: '',
      locked: false
    };
  };

  // Handler funkcie pre ManageItems
  const handleAddDaily = (item: any) => addDailyItem(createItem(item));
  const handleAddWeekly = (item: any) => addWeeklyItem(createItem(item));
  const handleAddMonthly = (item: any) => addMonthlyItem(createItem(item));

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

  // Stránka: Denná inventúra
  if (currentPage === 'daily-inventory') {
    return (
      <div className="dashboard">
        <Header onNavigate={setCurrentPage} />
        
        <div className="dashboard-topbar">
          <div className="user-info">
            <span>👤 {user?.username}</span>
          </div>
          <div className="actions">
            <button onClick={logout} className="btn-logout">
              🚪 Odhlásiť
            </button>
          </div>
        </div>

        <div className="container">
          <DailyInventory onBack={() => setCurrentPage('inventory')} />
        </div>
      </div>
    );
  }

  // Stránka: Týždenná inventúra
  if (currentPage === 'weekly-inventory') {
    return (
      <div className="dashboard">
        <Header onNavigate={setCurrentPage} />
        
        <div className="dashboard-topbar">
          <div className="user-info">
            <span>👤 {user?.username}</span>
          </div>
          <div className="actions">
            <button onClick={logout} className="btn-logout">
              🚪 Odhlásiť
            </button>
          </div>
        </div>

        <div className="container">
          <WeeklyInventory onBack={() => setCurrentPage('inventory')} />
        </div>
      </div>
    );
  }

  // Stránka: Mesačná inventúra
  if (currentPage === 'monthly-inventory') {
    return (
      <div className="dashboard">
        <Header onNavigate={setCurrentPage} />
        
        <div className="dashboard-topbar">
          <div className="user-info">
            <span>👤 {user?.username}</span>
          </div>
          <div className="actions">
            <button onClick={logout} className="btn-logout">
              🚪 Odhlásiť
            </button>
          </div>
        </div>

        <div className="container">
          <MonthlyInventory onBack={() => setCurrentPage('inventory')} />
        </div>
      </div>
    );
  }

  // Stránka: Zoznam surovín
  if (currentPage === 'materials-list') {
    return (
      <div className="dashboard">
        <Header onNavigate={setCurrentPage} />
        
        <div className="dashboard-topbar">
          <div className="user-info">
            <span>👤 {user?.username}</span>
          </div>
          <div className="actions">
            <button onClick={logout} className="btn-logout">
              🚪 Odhlásiť
            </button>
          </div>
        </div>

        <div className="container">
          <MaterialsList
            dailyItems={dailyItems}
            weeklyItems={weeklyItems}
            monthlyItems={monthlyItems}
            onBack={() => setCurrentPage('inventory')}
          />
        </div>
      </div>
    );
  }


  // Stránka: Správa položiek
  if (currentPage === 'manage-items') {
    return (
      <div className="dashboard">
        <Header onNavigate={setCurrentPage} />
        
        <div className="dashboard-topbar">
          <div className="user-info">
            <span>👤 {user?.username}</span>
          </div>
          <div className="actions">
            <button onClick={logout} className="btn-logout">
              🚪 Odhlásiť
            </button>
          </div>
        </div>

        <div className="container">
          <ManageItems
            dailyItems={dailyItems}
            weeklyItems={weeklyItems}
            monthlyItems={monthlyItems}
            onAddDaily={handleAddDaily}
            onAddWeekly={handleAddWeekly}
            onAddMonthly={handleAddMonthly}
            onEditDaily={editDailyItem}
            onEditWeekly={editWeeklyItem}
            onEditMonthly={editMonthlyItem}
            onDeleteDaily={deleteDailyItem}
            onDeleteWeekly={deleteWeeklyItem}
            onDeleteMonthly={deleteMonthlyItem}
            onBack={() => setCurrentPage('inventory')}
          />
        </div>
      </div>
    );
  }

  // Hlavná stránka: Inventúra
  return (
    <div className="dashboard">
      <Header onNavigate={setCurrentPage} />
      
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
          items={items}
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