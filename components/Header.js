import { useState } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { isRegistered } from '../lib/storage';

export default function Header({ theme, onToggleTheme }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const registered = isRegistered();

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
      padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '20px', color: 'var(--accent)' }}>
        GENZEE
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {registered && (
          <span className="badge" style={{ fontSize: '11px', padding: '3px 8px' }}>
            ✓ Registered
          </span>
        )}
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <button 
          onClick={() => setSidebarOpen(true)}
          style={{ padding: '10px', background: 'transparent', color: 'var(--text-primary)', fontSize: '24px' }}
          aria-label="Menu"
        >
          ☰
        </button>
      </div>

      {sidebarOpen && (
        <>
          <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </>
      )}
    </header>
  );
}
