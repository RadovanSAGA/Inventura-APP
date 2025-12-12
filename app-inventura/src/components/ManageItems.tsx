import { useState } from 'react';
import type { InventoryItem } from '../types';
import './ManageItems.css';

type InventoryType = 'daily' | 'weekly' | 'monthly';

interface ManageItemsProps {
  onBack: () => void;
  dailyItems: InventoryItem[];
  weeklyItems: InventoryItem[];
  monthlyItems: InventoryItem[];
  onAddDaily: (item: Omit<InventoryItem, 'id' | 'hodnota1' | 'hodnota2' | 'hodnota3' | 'locked' | 'poznamka' | 'celkom'>) => void;
  onAddWeekly: (item: Omit<InventoryItem, 'id' | 'hodnota1' | 'hodnota2' | 'hodnota3' | 'locked' | 'poznamka' | 'celkom'>) => void;
  onAddMonthly: (item: Omit<InventoryItem, 'id' | 'hodnota1' | 'hodnota2' | 'hodnota3' | 'locked' | 'poznamka' | 'celkom'>) => void;
  onEditDaily: (id: string, updates: Partial<InventoryItem>) => void;
  onEditWeekly: (id: string, updates: Partial<InventoryItem>) => void;
  onEditMonthly: (id: string, updates: Partial<InventoryItem>) => void;
  onDeleteDaily: (id: string) => void;
  onDeleteWeekly: (id: string) => void;
  onDeleteMonthly: (id: string) => void;
}

export function ManageItems({
  onBack,
  dailyItems,
  weeklyItems,
  monthlyItems,
  onAddDaily,
  onAddWeekly,
  onAddMonthly,
  onEditDaily,
  onEditWeekly,
  onEditMonthly,
  onDeleteDaily,
  onDeleteWeekly,
  onDeleteMonthly
}: ManageItemsProps) {
  const [activeType, setActiveType] = useState<InventoryType>('daily');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cisloPolozky: '',
    popis: '',
    baliacaJednotka: '',
    castkovaJedno: '',
    jednotka: '',
    stav: 'Aktívne'
  });

  const currentItems = activeType === 'daily' 
    ? dailyItems 
    : activeType === 'weekly' 
    ? weeklyItems 
    : monthlyItems;

  const handleAdd = activeType === 'daily' 
    ? onAddDaily 
    : activeType === 'weekly' 
    ? onAddWeekly 
    : onAddMonthly;

  const handleEdit = activeType === 'daily' 
    ? onEditDaily 
    : activeType === 'weekly' 
    ? onEditWeekly 
    : onEditMonthly;

  const handleDelete = activeType === 'daily' 
    ? onDeleteDaily 
    : activeType === 'weekly' 
    ? onDeleteWeekly 
    : onDeleteMonthly;

  // VYMAZAŤ VŠETKO
  const handleDeleteAll = () => {
    const typeLabel = getTypeLabel();
    if (window.confirm(`Naozaj chceš vymazať VŠETKY položky z ${typeLabel} inventúry? (${currentItems.length} položiek)`)) {
      if (window.confirm('Táto akcia je NEVRATNÁ! Si si istý?')) {
        currentItems.forEach(item => {
          handleDelete(item.id);
        });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      handleEdit(editingId, formData);
      setEditingId(null);
    } else {
      handleAdd(formData);
      setShowAddForm(false);
    }
    setFormData({
      cisloPolozky: '',
      popis: '',
      baliacaJednotka: '',
      castkovaJedno: '',
      jednotka: '',
      stav: 'Aktívne'
    });
  };

  const startEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setFormData({
      cisloPolozky: item.cisloPolozky,
      popis: item.popis,
      baliacaJednotka: item.baliacaJednotka,
      castkovaJedno: item.castkovaJedno,
      jednotka: item.jednotka,
      stav: item.stav
    });
    setShowAddForm(true);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormData({
      cisloPolozky: '',
      popis: '',
      baliacaJednotka: '',
      castkovaJedno: '',
      jednotka: '',
      stav: 'Aktívne'
    });
  };

  const getTypeLabel = () => {
    switch (activeType) {
      case 'daily': return 'Denná';
      case 'weekly': return 'Týždenná';
      case 'monthly': return 'Mesačná';
    }
  };

  return (
    <div className="manage-items">
      <div className="manage-header">
        <button onClick={onBack} className="btn-back">← Späť</button>
        <h2>📦 Správa položiek</h2>
        <div className="header-actions">
          {!showAddForm && (
            <button onClick={() => setShowAddForm(true)} className="btn-add">
              ➕ Pridať položku
            </button>
          )}
          {currentItems.length > 0 && (
            <button onClick={handleDeleteAll} className="btn-delete-all">
              🗑️ Vymazať všetko
            </button>
          )}
        </div>
      </div>

      {/* TABY PRE TYP INVENTÚRY */}
      <div className="inventory-type-tabs">
        <button
          className={`type-tab ${activeType === 'daily' ? 'active' : ''}`}
          onClick={() => {
            setActiveType('daily');
            setShowAddForm(false);
            setEditingId(null);
          }}
        >
          📅 Denná ({dailyItems.length})
        </button>
        <button
          className={`type-tab ${activeType === 'weekly' ? 'active' : ''}`}
          onClick={() => {
            setActiveType('weekly');
            setShowAddForm(false);
            setEditingId(null);
          }}
        >
          📊 Týždenná ({weeklyItems.length})
        </button>
        <button
          className={`type-tab ${activeType === 'monthly' ? 'active' : ''}`}
          onClick={() => {
            setActiveType('monthly');
            setShowAddForm(false);
            setEditingId(null);
          }}
        >
          📈 Mesačná ({monthlyItems.length})
        </button>
      </div>

      <div className="active-type-indicator">
        Upravuješ: <strong>{getTypeLabel()} inventúru</strong> ({currentItems.length} položiek)
      </div>

      {showAddForm && (
        <div className="item-form">
          <h3>{editingId ? '✏️ Upraviť položku' : '➕ Nová položka'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Číslo položky *</label>
                <input
                  type="text"
                  value={formData.cisloPolozky}
                  onChange={(e) => setFormData({ ...formData, cisloPolozky: e.target.value })}
                  required
                  placeholder="napr. 5847/076"
                />
              </div>
              <div className="form-group">
                <label>Stav</label>
                <select
                  value={formData.stav}
                  onChange={(e) => setFormData({ ...formData, stav: e.target.value })}
                >
                  <option value="Aktívne">Aktívne</option>
                  <option value="Predaktivácia">Predaktivácia</option>
                  <option value="Neaktívne">Neaktívne</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Popis *</label>
              <input
                type="text"
                value={formData.popis}
                onChange={(e) => setFormData({ ...formData, popis: e.target.value })}
                required
                placeholder="napr. SNIDANOVY PAPIER GEN"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Jednotka 1 *</label>
                <input
                  type="text"
                  value={formData.baliacaJednotka}
                  onChange={(e) => setFormData({ ...formData, baliacaJednotka: e.target.value })}
                  required
                  placeholder="napr. BAL"
                />
              </div>
              <div className="form-group">
                <label>Jednotka 2 *</label>
                <input
                  type="text"
                  value={formData.castkovaJedno}
                  onChange={(e) => setFormData({ ...formData, castkovaJedno: e.target.value })}
                  required
                  placeholder="napr. KUS"
                />
              </div>
              <div className="form-group">
                <label>Jednotka 3 *</label>
                <input
                  type="text"
                  value={formData.jednotka}
                  onChange={(e) => setFormData({ ...formData, jednotka: e.target.value })}
                  required
                  placeholder="napr. KU"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">
                {editingId ? '💾 Uložiť' : '➕ Pridať'}
              </button>
              <button type="button" onClick={cancelForm} className="btn-cancel">
                ❌ Zrušiť
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="items-list">
        <table className="items-table">
          <thead>
            <tr>
              <th>Číslo</th>
              <th>Popis</th>
              <th>Jednotka 1</th>
              <th>Jednotka 2</th>
              <th>Jednotka 3</th>
              <th>Stav</th>
              <th>Akcie</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty">
                  Žiadne položky v {getTypeLabel()} inventúre
                </td>
              </tr>
            ) : (
              currentItems.map((item) => (
                <tr key={item.id}>
                  <td className="td-mono">{item.cisloPolozky}</td>
                  <td className="td-bold">{item.popis}</td>
                  <td><span className="badge-sm">{item.baliacaJednotka}</span></td>
                  <td><span className="badge-sm">{item.castkovaJedno}</span></td>
                  <td><span className="badge-sm">{item.jednotka}</span></td>
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
                  <td className="td-actions">
                    <button onClick={() => startEdit(item)} className="btn-edit">✏️</button>
                    <button onClick={() => {
                      if (window.confirm(`Naozaj vymazať položku ${item.cisloPolozky}?`)) {
                        handleDelete(item.id);
                      }
                    }} className="btn-delete">🗑️</button>
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