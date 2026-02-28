import { useState, useEffect } from 'react';
import { getHistory, clearHistory, loadPreferences, savePreferences } from '../lib/storage';

export default function History() {
  const [history, setHistory] = useState([]);
  const [showWarning, setShowWarning] = useState(false);
  const prefs = loadPreferences();

  useEffect(() => {
    const items = getHistory();
    setHistory(items);
    
    // Show warning if >50 items and not dismissed
    if (items.length > 50 && !prefs.hideHistoryWarning) {
      setShowWarning(true);
    }
  }, []);

  const handleDownload = (item) => {
    const a = document.createElement('a');
    a.href = item.imageUrl;
    a.download = `genzee-${item.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = (id) => {
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem('genzee:history', JSON.stringify(updated));
    setHistory(updated);
  };

  const handleClearAll = () => {
    if (confirm('Delete all history? This cannot be undone.')) {
      clearHistory();
      setHistory([]);
    }
  };

  const handleDismissWarning = () => {
    setShowWarning(false);
    savePreferences({ ...prefs, hideHistoryWarning: true });
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2>📚 Generation History</h2>
        {history.length > 0 && (
          <button onClick={handleClearAll} style={{ padding: '8px 16px', fontSize: '13px', background: 'var(--error)' }}>
            🗑️ Clear All
          </button>
        )}
      </div>

      {showWarning && (
        <div className="card" style={{ border: '2px solid var(--accent)', marginBottom: '15px' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '10px' }}>💡 Storage Tip</p>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
            You have {history.length} images saved. Large history may slow down your browser.
          </p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleClearAll} style={{ flex: 1 }}>🗑️ Clear History</button>
            <button onClick={handleDismissWarning} style={{ flex: 1, background: 'var(--bg-tertiary)' }}>Don't Show Again</button>
          </div>
        </div>
      )}

      {history.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '48px' }}>📭</p>
          <p>No images yet. Start generating!</p>
        </div>
      ) : (
        <div className="image-grid">
          {history.map(item => (
            <div key={item.id} className="image-card">
              <img src={item.imageUrl} alt={item.prompt} />
              <div className="actions">
                <button onClick={() => handleDownload(item)} title="Download">⬇️</button>
                <button onClick={() => handleDelete(item.id)} title="Delete" style={{ background: 'var(--error)' }}>🗑️</button>
              </div>
              <p style={{ fontSize: '12px', padding: '8px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.prompt}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
