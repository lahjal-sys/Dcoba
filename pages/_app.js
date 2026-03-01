import '../styles/globals.css';
import { useEffect, useState } from 'react';
// import { loadTheme, saveTheme } from '../lib/storage'; // ← Bisa dihapus kalau mau simpel

export default function App({ Component, pageProps }) {
  const [theme, setTheme] = useState('dark');

  // ✅ Akses localStorage HANYA setelah component mount di browser
  useEffect(() => {
    const saved = localStorage.getItem('genzee:theme');
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('genzee:theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <Component {...pageProps} />
    </>
  );
}
