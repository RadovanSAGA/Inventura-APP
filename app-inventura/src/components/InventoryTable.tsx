import { useMemo } from 'react';
import type { InventoryItem } from '../types';
import { InventoryRow } from './InventoryRow';
import './InventoryTable.css';

interface InventoryTableProps {
  items: InventoryItem[];
  searchTerm: string;
  onUpdate: (id: string, updates: Partial<InventoryItem>) => void;
  onToggleLock: (id: string) => void;
}

export function InventoryTable({ items, searchTerm, onUpdate, onToggleLock }: InventoryTableProps) {
  const filteredItems = useMemo(() => {
    if (!searchTerm) return items;
    const search = searchTerm.toLowerCase();
    return items.filter(item =>
      item.cisloPolozky.toLowerCase().includes(search) ||
      item.popis.toLowerCase().includes(search)
    );
  }, [items, searchTerm]);

  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>
            <th>ČÍSLO</th>
            <th>POPIS</th>
            <th>JEDNOTKA 1</th>
            <th>JEDNOTKA 2</th>
            <th>JEDNOTKA 3</th>
            <th>POZNÁMKA</th>
            <th>✓</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length > 0 ? (
            filteredItems.map(item => (
              <InventoryRow
                key={item.id}
                item={item}
                onUpdate={onUpdate}
                onToggleLock={onToggleLock}
              />
            ))
          ) : (
            <tr>
              <td colSpan={7} className="empty">Žiadne položky</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}