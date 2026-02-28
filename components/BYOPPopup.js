import { useState } from 'react';
import { initiateBYOP, markAsRegistered, saveAPIKey, savePreferences } from '../lib/storage';

export default function BYOPPopup({ model, onClose, onConnect }) {
  const [saveLogin, setSaveLogin] = useState(true);
  const [dontShow, setDontShow] = useState(false);

  const handleConnect = () => {
    if (saveLogin) {
      markAsRegistered();
      savePreferences({ saveLogin: true });
    }
    if (dontShow) {
      const prefs = { ...(JSON.parse(localStorage.getItem('genzee:prefs')) || {}), hideLimitPopup: true };
      savePreferences(prefs);
    }
    const authUrl = initiateBYOP(window.location.href.split('#')[0]);
    window.location.href = authUrl;
  };

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup" onClick={e => e.stopPropagation()}>
        <h3>🔓 Unlock Unlimited Generates</h3>
        <p>
          You've reached the free limit for <strong>{model}</strong>.
        </p>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
          Connect your Pollinations account to continue. Your pollen balance will be used for generations.
        </p>
        
        <div style={{ textAlign: 'left', margin: '15px 0', fontSize: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <input type="checkbox" checked={saveLogin} onChange={e => setSaveLogin(e.target.checked)} />
            <span>✓ Save login to this browser</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" checked={dontShow} onChange={e => setDontShow(e.target.checked)} />
            <span>Don't show this popup again</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleConnect} style={{ flex: 2 }}>🔗 Connect Now</button>
          <button onClick={onClose} style={{ flex: 1, background: 'var(--bg-tertiary)' }}>Maybe Later</button>
        </div>
      </div>
    </div>
  );
}
