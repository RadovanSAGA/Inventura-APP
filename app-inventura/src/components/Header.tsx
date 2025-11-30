import { useState } from 'react';
import './Header.css';

export function Header() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <header className="hdr">
      <div className="hdr-container">
        <h1 className="hdr-title">Inventúra</h1>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="hdr-date"
        />
      </div>
    </header>
  );
}