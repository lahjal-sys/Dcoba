import { useState } from 'react';

export default function ImagePreview({ imageUrl, onDownload, loading, error }) {
  const [imgError, setImgError] = useState(false);

  if (loading) {
    return (
      <div className="card" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
        <p style={{ marginTop: '15px', color: 'var(--text-secondary)' }}>Creating your image...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--error)' }}>
        <p>❌ {error}</p>
      </div>
    );
  }

  if (!imageUrl || imgError) {
    return (
      <div className="card" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ fontSize: '48px' }}>🖼️</div>
        <p style={{ marginTop: '10px' }}>Image will appear here</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <img 
        src={imageUrl} 
        alt="Generated" 
        style={{ width: '100%', height: 'auto', display: 'block' }}
        onError={() => setImgError(true)}
      />
      <div style={{ padding: '15px', display: 'flex', gap: '10px' }}>
        <button onClick={onDownload} style={{ flex: 1 }}>📥 Download</button>
        <button onClick={() => window.open(imageUrl, '_blank')} style={{ flex: 1, background: 'var(--bg-tertiary)' }}>🔗 Open</button>
      </div>
    </div>
  );
}
