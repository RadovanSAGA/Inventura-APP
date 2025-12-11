import { useState, useRef, useEffect } from 'react';
import './SettingsDropdown.css';

interface SettingsDropdownProps {
  onNavigate: (page: 'manage-items' | 'materials-list' | 'daily-inventory' | 'weekly-inventory' | 'monthly-inventory') => void;
}

export function SettingsDropdown({ onNavigate }: SettingsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="settings-dropdown" ref={dropdownRef}>
      <button 
        className="settings-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        ⚙️ Nastavenia
      </button>
      
      {isOpen && (
        <div className="settings-menu">
          <button 
            className="settings-item"
            onClick={() => {
              onNavigate('manage-items');
              setIsOpen(false);
            }}
          >
            📦 Správa položiek
          </button>

          <button 
            className="settings-item"
            onClick={() => {
              onNavigate('materials-list');
              setIsOpen(false);
            }}
          >
            📋 Zoznam surovín
          </button>
          
          <div className="settings-divider"></div>
          
          <div className="settings-section-title">Typy inventúr</div>
          
          <button 
            className="settings-item"
            onClick={() => {
              onNavigate('daily-inventory');
              setIsOpen(false);
            }}
          >
            📅 Denná inventúra
          </button>
          
          <button 
            className="settings-item"
            onClick={() => {
              onNavigate('weekly-inventory');
              setIsOpen(false);
            }}
          >
            📊 Týždenná inventúra
          </button>
          
          <button 
            className="settings-item"
            onClick={() => {
              onNavigate('monthly-inventory');
              setIsOpen(false);
            }}
          >
            📈 Mesačná inventúra
          </button>
        </div>
      )}
    </div>
  );
}