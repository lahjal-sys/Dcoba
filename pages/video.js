import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isRegistered } from '../lib/storage';
import BYOPPopup from '../components/BYOPPopup';

export default function Video() {
  const router = useRouter();
  const registered = isRegistered();

  useEffect(() => {
    if (!registered) {
      // Show registration popup immediately
      document.body.style.overflow = 'hidden';
    }
  }, []);

  const handleClose = () => {
    document.body.style.overflow = '';
    router.push('/');
  };

  if (!registered) {
    return (
      <BYOPPopup 
        model="video" 
        onClose={handleClose}
        onConnect={() => {}}
      />
    );
  }

  return (
    <div className="container">
      <div className="card" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div>
          <p style={{ fontSize: '48px' }}>🎬</p>
          <h3>Video Generation</h3>
          <p style={{ color: 'var(--text-secondary)', margin: '15px 0' }}>
            Video generation is coming soon! 
            <br />For now, try Image generation with different aspect ratios.
          </p>
          <button onClick={() => router.push('/?tab=image')} style={{ marginTop: '15px' }}>
            🎨 Go to Image Generator
          </button>
        </div>
      </div>
    </div>
  );
}
