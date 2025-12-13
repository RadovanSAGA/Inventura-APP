import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ManageItems } from '../components/ManageItems';
import { MaterialsList } from '../components/MaterialsList';
import { DailyInventory } from '../components/DailyInventory';
import { WeeklyInventory } from '../components/WeeklyInventory';
import { MonthlyInventory } from '../components/MonthlyInventory';
import { useInventory } from '../hooks/useInventory';
import './Dashboard.css';

type Page = 'home' | 'daily' | 'weekly' | 'monthly' | 'materials' | 'settings' | 'manage-items';

const SETTINGS_PASSWORD = '4213';

export function Dashboard() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  
  // ZOOM / VEĽKOSŤ TEXTU
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('app-font-size');
    return saved ? parseInt(saved) : 100;
  });

  // Aplikuj veľkosť na celú stránku
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem('app-font-size', fontSize.toString());
  }, [fontSize]);

  const increaseFontSize = () => {
    if (fontSize < 150) setFontSize(prev => prev + 10);
  };

  const decreaseFontSize = () => {
    if (fontSize > 60) setFontSize(prev => prev - 10);
  };

  // Inventúry
  const {
    items: dailyItems,
    loading: dailyLoading,
    addItem: addDailyItem,
    editItem: editDailyItem,
    deleteItem: deleteDailyItem
  } = useInventory('daily');

  const {
    items: weeklyItems,
    loading: weeklyLoading,
    addItem: addWeeklyItem,
    editItem: editWeeklyItem,
    deleteItem: deleteWeeklyItem
  } = useInventory('weekly');

  const {
    items: monthlyItems,
    loading: monthlyLoading,
    addItem: addMonthlyItem,
    editItem: editMonthlyItem,
    deleteItem: deleteMonthlyItem
  } = useInventory('monthly');

  // Overenie hesla pre nastavenia
  const handleSettingsClick = () => {
    setPasswordPrompt(true);
    setPasswordInput('');
    setPasswordError(false);
    setMenuOpen(false);
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === SETTINGS_PASSWORD) {
      setPasswordPrompt(false);
      setCurrentPage('settings');
    } else {
      setPasswordError(true);
    }
  };

  // MENU COMPONENT
  const MenuBar = () => (
    <div className="menu-bar">
      <div className="menu-logo" onClick={() => setCurrentPage('home')}>
        📦 Inventúra
      </div>
      <button className="menu-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>
      
      {menuOpen && (
        <div className="menu-dropdown">
          {/* VEĽKOSŤ TEXTU */}
          <div className="menu-font-size">
            <span>Aa Veľkosť textu</span>
            <div className="font-size-controls">
              <button onClick={decreaseFontSize} disabled={fontSize <= 60}>−</button>
              <span className="font-size-value">{fontSize}%</span>
              <button onClick={increaseFontSize} disabled={fontSize >= 150}>+</button>
            </div>
          </div>
          <hr />
          <button onClick={() => { setCurrentPage('materials'); setMenuOpen(false); }}>
            📋 Zoznam surovín
          </button>
          <button onClick={handleSettingsClick}>
            ⚙️ Nastavenia 🔒
          </button>
          <hr />
          <button onClick={logout} className="menu-logout">
            🚪 Odhlásiť sa
          </button>
        </div>
      )}
    </div>
  );

  // PASSWORD MODAL
  const PasswordModal = () => (
    <div className="password-overlay" onClick={() => setPasswordPrompt(false)}>
      <div className="password-modal" onClick={e => e.stopPropagation()}>
        <h3>🔒 Zadaj heslo</h3>
        <input
          type="password"
          value={passwordInput}
          onChange={e => setPasswordInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
          placeholder="Heslo..."
          autoFocus
        />
        {passwordError && <p className="password-error">❌ Nesprávne heslo!</p>}
        <div className="password-buttons">
          <button onClick={() => setPasswordPrompt(false)}>Zrušiť</button>
          <button onClick={handlePasswordSubmit} className="btn-primary">Potvrdiť</button>
        </div>
      </div>
    </div>
  );

  // Loading state
  const isLoading = dailyLoading || weeklyLoading || monthlyLoading;

  // ========== PAGES ==========

  // ÚVODNÁ OBRAZOVKA
  if (currentPage === 'home') {
    return (
      <div className="dashboard">
        <MenuBar />
        {passwordPrompt && <PasswordModal />}
        
        <div className="home-screen">
          <div className="welcome-section">
            <h1>👋 Ahoj, {user?.username}!</h1>
            <p>Vyber typ inventúry:</p>
          </div>
          
          {isLoading ? (
            <div className="loading">Načítavam položky...</div>
          ) : (
            <div className="inventory-buttons">
              <button 
                className="inventory-card daily"
                onClick={() => setCurrentPage('daily')}
              >
                <span className="card-icon">📅</span>
                <span className="card-title">Denná</span>
                <span className="card-count">{dailyItems.length} položiek</span>
              </button>
              
              <button 
                className="inventory-card weekly"
                onClick={() => setCurrentPage('weekly')}
              >
                <span className="card-icon">📆</span>
                <span className="card-title">Týždenná</span>
                <span className="card-count">{weeklyItems.length} položiek</span>
              </button>
              
              <button 
                className="inventory-card monthly"
                onClick={() => setCurrentPage('monthly')}
              >
                <span className="card-icon">🗓️</span>
                <span className="card-title">Mesačná</span>
                <span className="card-count">{monthlyItems.length} položiek</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // DENNÁ INVENTÚRA
  if (currentPage === 'daily') {
    return (
      <div className="dashboard">
        <MenuBar />
        {passwordPrompt && <PasswordModal />}
        <div className="container">
          <DailyInventory onBack={() => setCurrentPage('home')} />
        </div>
      </div>
    );
  }

  // TÝŽDENNÁ INVENTÚRA
  if (currentPage === 'weekly') {
    return (
      <div className="dashboard">
        <MenuBar />
        {passwordPrompt && <PasswordModal />}
        <div className="container">
          <WeeklyInventory onBack={() => setCurrentPage('home')} />
        </div>
      </div>
    );
  }

  // MESAČNÁ INVENTÚRA
  if (currentPage === 'monthly') {
    return (
      <div className="dashboard">
        <MenuBar />
        {passwordPrompt && <PasswordModal />}
        <div className="container">
          <MonthlyInventory onBack={() => setCurrentPage('home')} />
        </div>
      </div>
    );
  }

  // ZOZNAM SUROVÍN
  if (currentPage === 'materials') {
    return (
      <div className="dashboard">
        <MenuBar />
        {passwordPrompt && <PasswordModal />}
        <div className="container">
          <MaterialsList
            dailyItems={dailyItems}
            weeklyItems={weeklyItems}
            monthlyItems={monthlyItems}
            onBack={() => setCurrentPage('home')}
          />
        </div>
      </div>
    );
  }

  // NASTAVENIA
  if (currentPage === 'settings') {
    return (
      <div className="dashboard">
        <MenuBar />
        <div className="container">
          <div className="settings-page">
            <button className="back-button" onClick={() => setCurrentPage('home')}>
              ← Späť
            </button>
            <h2>⚙️ Nastavenia</h2>
            
            <div className="settings-list">
              <button 
                className="settings-item"
                onClick={() => setCurrentPage('manage-items')}
              >
                <span>✏️ Správa položiek</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SPRÁVA POLOŽIEK
  if (currentPage === 'manage-items') {
    return (
      <div className="dashboard">
        <MenuBar />
        <div className="container">
          <ManageItems
            dailyItems={dailyItems}
            weeklyItems={weeklyItems}
            monthlyItems={monthlyItems}
            onAddDaily={addDailyItem}
            onAddWeekly={addWeeklyItem}
            onAddMonthly={addMonthlyItem}
            onEditDaily={editDailyItem}
            onEditWeekly={editWeeklyItem}
            onEditMonthly={editMonthlyItem}
            onDeleteDaily={deleteDailyItem}
            onDeleteWeekly={deleteWeeklyItem}
            onDeleteMonthly={deleteMonthlyItem}
            onBack={() => setCurrentPage('settings')}
          />
        </div>
      </div>
    );
  }

  return null;
}