export default function ThemeToggle({ theme, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        padding: '10px', background: 'transparent',
        color: 'var(--text-primary)', fontSize: '20px',
        display: 'flex', alignItems: 'center'
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
