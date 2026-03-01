import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { generateImage, MODELS, ASPECT_RATIOS } from '../lib/pollinations';
import { 
  loadAPIKey, saveGenerateCount, getGenerateCount, 
  saveHistory, getHistory, loadPreferences, incrementUsage,
  isRegistered, markAsRegistered, saveAPIKey
} from '../lib/storage';
import { parseAuthCallback } from '../lib/pollinations';
import ModelSelector from '../components/ModelSelector';
import AspectRatioSelector from '../components/AspectRatioSelector';
import PromptControls from '../components/PromptControls';
import ImagePreview from '../components/ImagePreview';
import BYOPPopup from '../components/BYOPPopup';
import UsageStats from '../components/UsageStats';

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState(MODELS.FLUX);
  const [ratio, setRatio] = useState(ASPECT_RATIOS[0].value);
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showBYOP, setShowBYOP] = useState(false);
  const [balance, setBalance] = useState(null);
  const [used, setUsed] = useState(0);

  // Handle Pollinations auth callback
  useEffect(() => {
    const { apiKey, error: authError } = parseAuthCallback();
    if (apiKey) {
      saveAPIKey(apiKey);
      markAsRegistered();
      fetchBalance(apiKey);
    }
    if (authError) {
      setError(`Auth failed: ${authError}`);
    }
  }, []);

  // Fetch balance if registered
  const fetchBalance = async (apiKey) => {
    // Simplified: in real app, call Pollinations API
    // For demo, show mock data
    setBalance(1.25);
    setUsed(0.03);
  };

  const selectedRatio = ASPECT_RATIOS.find(r => r.value === ratio) || ASPECT_RATIOS[0];
  // 🔑 Hardcode key yang sudah terbukti work
const API_KEY = 'pk_pzzzpBDHbpUyct83';
  const registered = isRegistered();
  const prefs = loadPreferences();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    // Check limits for limited models
    if ([MODELS.KONTEXT, MODELS.KLEIN].includes(model)) {
      const count = getGenerateCount(model);
      if (!registered && count >= 3) {
        setShowBYOP(true);
        return;
      }
    }

    setLoading(true);
    setError('');
    setImageUrl('');

    try {
      const [width, height] = ratio.split('x').map(Number);
      const buffer = await generateImage(prompt, {
        model, width, height, apiKey
      });
      
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
      
      // Save to history
      const historyCount = saveHistory({ imageUrl: url, prompt, model, ratio, date: new Date().toISOString() });
      
      // Show history warning if >50
      if (historyCount > 50 && !prefs.hideHistoryWarning) {
        alert('💡 Tip: You have 50+ images in history. Consider downloading & clearing cache to free up space.');
      }
      
      // Update counts & usage
      if ([MODELS.KONTEXT, MODELS.KLEIN].includes(model) && !registered) {
        saveGenerateCount(model, getGenerateCount(model) + 1);
      }
      incrementUsage(model);
      
    } catch (err) {
      setError(err.message || 'Failed to generate image');
      if (err.message?.includes('402')) {
        setError('Insufficient pollen balance. Please top up at enter.pollinations.ai');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `genzee-${model}-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleModelLimit = (limitedModel) => {
    setShowBYOP(true);
  };

  // Share functionality (PWA)
  const handleShare = async () => {
    if (!imageUrl || !navigator.share) return;
    try {
      const blob = await fetch(imageUrl).then(r => r.blob());
      const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
      await navigator.share({ files: [file], title: 'GENZEE', text: prompt });
    } catch (e) {
      // Fallback: copy URL
      navigator.clipboard?.writeText(imageUrl);
      alert('Image URL copied to clipboard!');
    }
  };

  return (
    <div className="container">
      {/* Balance Display */}
      {registered && balance !== null && (
        <div className="card" style={{ padding: '12px', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
          <span>🌸 Pollen Balance</span>
          <span><strong>{used.toFixed(3)} used</strong> / {balance.toFixed(2)} total</span>
        </div>
      )}

      {/* Usage Stats */}
      <UsageStats />

      {/* Prompt Input */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your image... (English works best)"
        rows="3"
        style={{ margin: '15px 0', resize: 'vertical', minHeight: '80px' }}
      />

      {/* Prompt Controls */}
      <PromptControls value={prompt} onChange={setPrompt} onGenerate={handleGenerate} />

      {/* Model Selector */}
      <ModelSelector 
        selectedModel={model} 
        onModelChange={setModel} 
        onLimitReached={handleModelLimit}
      />

      {/* Aspect Ratio */}
      <AspectRatioSelector selected={ratio} onChange={setRatio} />

      {/* Generate Button (mobile sticky) */}
      <button 
        onClick={handleGenerate} 
        disabled={loading || !prompt.trim()}
        style={{ width: '100%', padding: '16px', fontSize: '18px', margin: '15px 0' }}
      >
        {loading ? '⏳ Generating...' : '🎨 Generate Image'}
      </button>

      {/* Image Preview */}
      <ImagePreview 
        imageUrl={imageUrl} 
        onDownload={handleDownload} 
        loading={loading} 
        error={error}
      />

      {/* Share Button (if supported) */}
      {imageUrl && navigator.share && (
        <button 
          onClick={handleShare}
          style={{ width: '100%', marginTop: '10px', background: 'var(--bg-tertiary)' }}
        >
          📤 Share Image
        </button>
      )}

      {/* BYOP Popup */}
      {showBYOP && (
        <BYOPPopup 
          model={model} 
          onClose={() => setShowBYOP(false)} 
          onConnect={() => {}}
        />
      )}
    </div>
  );
}
