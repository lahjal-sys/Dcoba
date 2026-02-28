import '../styles/globals.css';
import { useEffect, useState } from 'react';
import { loadTheme, saveTheme } from '../lib/storage';
import Header from '../components/Header';

export default function App({ Component, pageProps }) {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = loadTheme();
    if (saved) setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved || 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    saveTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <>
      <Header theme={theme} onToggleTheme={toggleTheme} />
      <Component {...pageProps} />
    </>
  );
}
