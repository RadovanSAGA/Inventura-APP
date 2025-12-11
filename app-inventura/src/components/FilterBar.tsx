 import { useState } from 'react';
import { ExportPreview } from './ExportPreview';
import type { InventoryItem } from '../types';
import './FilterBar.css';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
  onReset: () => void;
  totalItems: number;
  lockedCount: number;
  items: InventoryItem[];
}

export function FilterBar({
  searchTerm,
  onSearchChange,
  onExport,
  onReset,
  totalItems,
  lockedCount,
  items
}: FilterBarProps) {
  const [showExportPreview, setShowExportPreview] = useState(false);
  const progress = totalItems > 0 ? Math.round((lockedCount / totalItems) * 100) : 0;

  return (
    <>
      <div className="fbar">
        <div className="fbar-top">
          <input
            type="text"
            placeholder="Hľadať..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="fbar-search"
          />
          <button onClick={() => setShowExportPreview(true)} className="btn btn-green">
            Export
          </button>
          <button onClick={onReset} className="btn btn-gray">Reset</button>
        </div>
        
        <div className="fbar-stats">
          <span>Celkom: <b>{totalItems}</b></span>
          <span>Hotovo: <b>{lockedCount}</b></span>
          <span>Progres: <b>{progress}%</b></span>
        </div>

        <div className="fbar-prog">
          <div className="fbar-prog-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {showExportPreview && (
        <ExportPreview
          items={items}
          onClose={() => setShowExportPreview(false)}
          title="INVENTURA"
        />
      )}
    </>
  );
}