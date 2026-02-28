import { generateRandomPrompt, regeneratePrompt } from '../lib/pollinations';
import { useState } from 'react';

export default function PromptControls({ value, onChange, onGenerate }) {
  const [loading, setLoading] = useState(false);

  const handleRandom = async () => {
    setLoading(true);
    try {
      const prompt = await generateRandomPrompt();
      onChange(prompt);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!value.trim()) return;
    setLoading(true);
    try {
      const newPrompt = await regeneratePrompt(value);
      onChange(newPrompt);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '8px', margin: '10px 0' }}>
      <button 
        type="button" 
        onClick={handleRandom} 
        disabled={loading}
        style={{ flex: 1, background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
      >
        🎲 Random
      </button>
      <button 
        type="button" 
        onClick={handleRegenerate} 
        disabled={loading || !value.trim()}
        style={{ flex: 1, background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}
      >
        ✨ Enhance
      </button>
      <button 
        type="button" 
        onClick={onGenerate} 
        disabled={loading || !value.trim()}
        style={{ flex: 2 }}
      >
        {loading ? '⏳' : '🚀 Generate'}
      </button>
    </div>
  );
}
