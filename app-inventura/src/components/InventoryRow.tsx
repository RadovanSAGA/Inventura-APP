import { useState, useEffect } from 'react';
import type { InventoryItem } from '../types';
import './InventoryRow.css';

interface InventoryRowProps {
  item: InventoryItem;
  onUpdate: (id: string, updates: Partial<InventoryItem>) => void;
  onToggleLock: (id: string) => void;
}

export function InventoryRow({ item, onUpdate, onToggleLock }: InventoryRowProps) {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [poznamka, setPoznamka] = useState('');

  // Reset len keď sa item.id zmení (nový item po resete)
  useEffect(() => {
    setInput1('');
    setInput2('');
    setInput3('');
    setPoznamka('');
  }, [item.id]);

  const calculateValue = (expression: string): number => {
    if (!expression || expression.trim() === '') return 0;
    try {
      const cleaned = expression.replace(/\s/g, '');
      if (cleaned.includes('+')) {
        return cleaned.split('+').reduce((sum, part) => sum + (Number(part) || 0), 0);
      }
      return Number(cleaned) || 0;
    } catch {
      return 0;
    }
  };

  const handleInput1Change = (value: string) => {
    if (item.locked) return;
    setInput1(value);
    onUpdate(item.id, { hodnota1: calculateValue(value) });
  };

  const handleInput2Change = (value: string) => {
    if (item.locked) return;
    setInput2(value);
    onUpdate(item.id, { hodnota2: calculateValue(value) });
  };

  const handleInput3Change = (value: string) => {
    if (item.locked) return;
    setInput3(value);
    onUpdate(item.id, { hodnota3: calculateValue(value) });
  };

  const handleNoteChange = (value: string) => {
    if (item.locked) return;
    setPoznamka(value);
    onUpdate(item.id, { poznamka: value });
  };

  return (
    <tr className={`row ${item.locked ? 'row-locked' : ''}`}>
      <td className="td-cislo">{item.cisloPolozky}</td>
      <td className="td-popis">{item.popis}</td>
      
      <td className="td-field">
        <span className="badge">{item.baliacaJednotka}</span>
        <input
          type="text"
          value={input1}
          onChange={(e) => handleInput1Change(e.target.value)}
          disabled={item.locked}
          className="inp"
          placeholder="0"
        />
        <span className="res">{item.hodnota1}</span>
      </td>
      
      <td className="td-field">
        <span className="badge">{item.castkovaJedno}</span>
        <input
          type="text"
          value={input2}
          onChange={(e) => handleInput2Change(e.target.value)}
          disabled={item.locked}
          className="inp"
          placeholder="0"
        />
        <span className="res">{item.hodnota2}</span>
      </td>
      
      <td className="td-field">
        <span className="badge">{item.jednotka}</span>
        <input
          type="text"
          value={input3}
          onChange={(e) => handleInput3Change(e.target.value)}
          disabled={item.locked}
          className="inp"
          placeholder="0"
        />
        <span className="res">{item.hodnota3}</span>
      </td>
      
      <td className="td-note">
        <input
          type="text"
          value={poznamka}
          onChange={(e) => handleNoteChange(e.target.value)}
          disabled={item.locked}
          className="inp-note"
          placeholder="..."
        />
      </td>
      
      <td className="td-check">
        <input
          type="checkbox"
          checked={item.locked}
          onChange={() => onToggleLock(item.id)}
          className="chk"
        />
      </td>
    </tr>
  );
}