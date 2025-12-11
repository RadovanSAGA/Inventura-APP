import { useState } from 'react';
import { SettingsDropdown } from './SettingsDropdown';
import './Header.css';

interface HeaderProps {
  onNavigate: (page: 'inventory' | 'manage-items') => void;
}

export function Header({ onNavigate }: HeaderProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <header className="hdr">
      <div className="hdr-container">
        <h1 className="hdr-title">Inventúra</h1>
        <div className="hdr-right">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="hdr-date"
          />
          <SettingsDropdown onNavigate={onNavigate} />
        </div>
      </div>
    </header>
  );
}