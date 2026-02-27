import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateImage = async () => {
    if (!prompt.trim()) {
      alert('Isi prompt dulu!');
      return;
    }

    setLoading(true);
    setError('');
    setImageUrl('');

    try {
      const seed = Math.floor(Math.random() * 999999);
      // Request ke API PROXY kita di Vercel (BUKAN langsung ke Pollinations!)
      const response = await fetch(`/api/generate?prompt=${encodeURIComponent(prompt)}&seed=${seed}`);
      
      if (!response.ok) {
        throw new Error('Failed to generate');
      }

      // Dapat image sebagai blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    } catch (err) {
      setError('Gagal generate. Coba prompt lain atau refresh halaman.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `ai-image-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: '#00d4ff', marginBottom: '10px' }}>
          🎨 AI Image Generator
        </h1>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: '30px', fontSize: '13px' }}>
          Powered by Vercel Proxy + Pollinations
        </p>

        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="cute cat in space, digital art..."
          onKeyPress={(e) => e.key === 'Enter' && generateImage()}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: '2px solid #2a2a4a',
            background: '#1a1a2e',
            color: 'white',
            fontSize: '16px',
            outline: 'none',
            marginBottom: '15px'
          }}
        />

        <button
          onClick={generateImage}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '12px',
            border: 'none',
            background: loading ? '#333' : 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
            color: 'white',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.5 : 1
          }}
        >
          {loading ? '⏳ Generating...' : '✨ Generate Image'}
        </button>

        <div style={{
          marginTop: '25px',
          background: '#1a1a2e',
          borderRadius: '16px',
          minHeight: '320px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px solid #2a2a4a',
          overflow: 'hidden'
        }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{
                width: '45px',
                height: '45px',
                border: '4px solid #2a2a4a',
                borderTop: '4px solid #00d4ff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 15px'
              }} />
              <p>Creating your image...</p>
            </div>
          )}

          {error && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#ff6b6b' }}>
              <p>❌ {error}</p>
            </div>
          )}

          {!loading && !error && !imageUrl && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#555' }}>
              <p style={{ fontSize: '48px' }}>🖼️</p>
              <p style={{ marginTop: '10px' }}>Image will appear here</p>
            </div>
          )}

          {imageUrl && (
            <img
              src={imageUrl}
              alt="AI Generated"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          )}
        </div>

        {imageUrl && (
          <button
            onClick={downloadImage}
            style={{
              width: '100%',
              padding: '14px',
              marginTop: '15px',
              borderRadius: '12px',
              border: '2px solid #00d4ff',
              background: 'transparent',
              color: '#00d4ff',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            📥 Download Image
          </button>
        )}

        <style jsx global>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
