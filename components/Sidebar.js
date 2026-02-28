import Link from 'next/link';
import { useRouter } from 'next/router';
import { isRegistered, initiateBYOP, savePreferences, loadPreferences } from '../lib/storage';
import { detectUserLanguage, translatePage } from '../lib/translator';
import { useEffect, useState } from 'react';

export default function Sidebar({ onClose }) {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const registered = isRegistered();

  useEffect(() => {
    detectUserLanguage().then(setLang);
  }, []);

  const handleTranslate = async () => {
    const target = lang === 'en' ? 'id' : 'en';
    translatePage(target);
    setLang(target);
  };

  const handleConnect = () => {
    const authUrl = initiateBYOP(window.location.href.split('#')[0]);
    window.location.href = authUrl;
  };

  const menuItems = [
    { href: '/', label: '🏠 Home', icon: '🏠' },
    { href: '/chat', label: '💬 Chat', icon: '💬' },
    { href: '/?tab=image', label: '🎨 Image', icon: '🎨', active: router.query.tab === 'image' },
    { href: '/video', label: '🎬 Video', icon: '🎬' },
    { href: '/history', label: '📚 History', icon: '📚' },
  ];

  return (
    <aside className="sidebar open">
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {menuItems.map(item => (
          <Link 
            key={item.href} 
            href={item.href}
            className={`menu-item ${item.active ? 'active' : ''}`}
            onClick={onClose}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        
        <div style={{ borderTop: '1px solid var(--border)', margin: '10px 0' }} />
        
        {!registered ? (
          <button onClick={handleConnect} style={{ width: '100%', marginBottom: '10px' }}>
            🔗 Connect Pollinations
          </button>
        ) : (
          <div style={{ padding: '10px', background: 'var(--bg-tertiary)', borderRadius: '10px', fontSize: '13px' }}>
            ✓ Connected to Pollinations
          </div>
        )}
        
        <a 
          href="https://enter.pollinations.ai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="menu-item"
          onClick={onClose}
        >
          🌐 Register at Pollinations
        </a>
        
        <button onClick={handleTranslate} className="menu-item" style={{ width: '100%', textAlign: 'left' }}>
          🌐 Translate to {lang === 'en' ? 'Indonesian' : 'English'}
        </button>
        
        <button onClick={onClose} className="menu-item" style={{ marginTop: 'auto', color: 'var(--error)' }}>
          ✕ Close Menu
        </button>
      </nav>
    </aside>
  );
}
