import { useState, useMemo } from 'react';
import type { InventoryItem } from '../types';
import './MaterialsList.css';

interface MaterialsListProps {
  onBack: () => void;
  dailyItems: InventoryItem[];
  weeklyItems: InventoryItem[];
  monthlyItems: InventoryItem[];
}

type ViewMode = 'all' | 'daily' | 'weekly' | 'monthly';

export function MaterialsList({ onBack, dailyItems, weeklyItems, monthlyItems }: MaterialsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('all');

  // VŠETKY = unique položky zo všetkých 3 inventúr
  const allItems = useMemo(() => {
    const itemsMap = new Map<string, InventoryItem>();
    
    [...dailyItems, ...weeklyItems, ...monthlyItems].forEach(item => {
      if (!itemsMap.has(item.cisloPolozky)) {
        itemsMap.set(item.cisloPolozky, item);
      }
    });
    
    return Array.from(itemsMap.values()).sort((a, b) => 
      a.cisloPolozky.localeCompare(b.cisloPolozky)
    );
  }, [dailyItems, weeklyItems, monthlyItems]);

  // Vyber správne items podľa viewMode
  const displayItems = useMemo(() => {
    switch (viewMode) {
      case 'all': return allItems;
      case 'daily': return dailyItems;
      case 'weekly': return weeklyItems;
      case 'monthly': return monthlyItems;
    }
  }, [viewMode, allItems, dailyItems, weeklyItems, monthlyItems]);

  // Filtrovanie
  const filteredItems = useMemo(() => {
    if (!searchTerm) return displayItems;
    const search = searchTerm.toLowerCase();
    return displayItems.filter(item =>
      item.cisloPolozky.toLowerCase().includes(search) ||
      item.popis.toLowerCase().includes(search) ||
      item.baliacaJednotka.toLowerCase().includes(search) ||
      item.castkovaJedno.toLowerCase().includes(search) ||
      item.jednotka.toLowerCase().includes(search)
    );
  }, [displayItems, searchTerm]);

  return (
    <div className="materials-list">
      <div className="materials-header">
        <button onClick={onBack} className="btn-back">← Späť</button>
        <h2>📋 Zoznam surovín</h2>
        <div className="materials-count">
          Celkom: <strong>{filteredItems.length}</strong> položiek
        </div>
      </div>

      <div className="materials-filters">
        <input
          type="text"
          placeholder="🔍 Hľadať podľa čísla, popisu, jednotky..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="materials-search"
        />

        <div className="view-mode-tabs">
          <button
            className={`view-tab ${viewMode === 'all' ? 'active' : ''}`}
            onClick={() => setViewMode('all')}
          >
            📦 Všetky ({allItems.length})
          </button>
          <button
            className={`view-tab ${viewMode === 'daily' ? 'active' : ''}`}
            onClick={() => setViewMode('daily')}
          >
            📅 Denná ({dailyItems.length})
          </button>
          <button
            className={`view-tab ${viewMode === 'weekly' ? 'active' : ''}`}
            onClick={() => setViewMode('weekly')}
          >
            📊 Týždenná ({weeklyItems.length})
          </button>
          <button
            className={`view-tab ${viewMode === 'monthly' ? 'active' : ''}`}
            onClick={() => setViewMode('monthly')}
          >
            📈 Mesačná ({monthlyItems.length})
          </button>
        </div>
      </div>

      <div className="materials-table-wrap">
        <table className="materials-table">
          <thead>
            <tr>
              <th>Číslo položky</th>
              <th>Popis</th>
              <th>Jednotka 1</th>
              <th>Jednotka 2</th>
              <th>Jednotka 3</th>
              <th>Stav</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty">
                  {searchTerm ? 'Nenašli sa žiadne výsledky' : 'Žiadne položky'}
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.id}>
                  <td className="td-mono">{item.cisloPolozky}</td>
                  <td className="td-bold">{item.popis}</td>
                  <td><span className="badge-unit">{item.baliacaJednotka}</span></td>
                  <td><span className="badge-unit">{item.castkovaJedno}</span></td>
                  <td><span className="badge-unit">{item.jednotka}</span></td>
                  <td>
                    <span className={`status ${
                      item.stav === 'Aktívne' 
                        ? 'status-active' 
                        : item.stav === 'Predaktivácia'
                        ? 'status-predaktivacia'
                        : 'status-inactive'
                    }`}>
                      {item.stav}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}