// Pollinations API utilities

const BASE_IMAGE_URL = 'https://gen.pollinations.ai/image';
const BASE_TEXT_URL = 'https://text.pollinations.ai';
const BASE_ACCOUNT_URL = 'https://api.pollinations.ai/account';

export const MODELS = {
  FLUX: 'flux',
  ZIMAGE_TURBO: 'zimage-turbo',
  KONTEXT: 'kontext',
  KLEIN: 'klein',
};

export const FREE_MODELS = [MODELS.FLUX, MODELS.ZIMAGE_TURBO];
export const LIMITED_MODELS = [MODELS.KONTEXT, MODELS.KLEIN];
export const LIMITED_GENERATE_COUNT = 3;

export const ASPECT_RATIOS = [
  { label: '1:1 Square', value: '1024x1024', w: 1024, h: 1024 },
  { label: '16:9 Landscape', value: '1280x720', w: 1280, h: 720 },
  { label: '9:16 Portrait', value: '720x1280', w: 720, h: 1280 },
  { label: '4:3 Classic', value: '1024x768', w: 1024, h: 768 },
];

export const buildImageUrl = (prompt, { model, width, height, seed, apiKey }) => {
  const params = new URLSearchParams({
    width, height, seed: seed || Math.floor(Math.random() * 999999),
    model, nologo: 'true',
  });
  if (apiKey) params.append('key', apiKey);
  return `${BASE_IMAGE_URL}/${encodeURIComponent(prompt)}?${params}`;
};

export const generateImage = async (prompt, options) => {
  const url = buildImageUrl(prompt, options);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);
  
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'GENZEE/1.0' }
    });
    clearTimeout(timeout);
    
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      throw new Error(`API ${response.status}: ${text.slice(0, 200)}`);
    }
    
    return await response.arrayBuffer();
  } catch (e) {
    clearTimeout(timeout);
    if (e.name === 'AbortError') throw new Error('Timeout: Server took too long');
    throw e;
  }
};

export const generateRandomPrompt = async () => {
  try {
    const response = await fetch(`${BASE_TEXT_URL}/Generate%20a%20creative%20image%20prompt%20in%205%20words`);
    return await response.text();
  } catch {
    // Fallback predefined prompts
    const fallbacks = [
      'cute cat in space', 'cyberpunk city at night', 'magical forest sunrise',
      'futuristic robot portrait', 'underwater coral reef', 'steampunk airship',
      'anime girl with cherry blossoms', 'minimalist geometric art'
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }
};

export const regeneratePrompt = async (originalPrompt) => {
  try {
    const response = await fetch(`${BASE_TEXT_URL}/Rewrite%20this%20prompt%20to%20be%20more%20creative%20and%20detailed:%20${encodeURIComponent(originalPrompt)}`);
    return await response.text();
  } catch {
    return originalPrompt;
  }
};

export const fetchAccountBalance = async (apiKey) => {
  if (!apiKey) return null;
  try {
    const response = await fetch(`${BASE_ACCOUNT_URL}/balance`, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
};

export const initiateBYOP = (redirectUrl) => {
  const params = new URLSearchParams({
    redirect_url: redirectUrl,
    models: [...FREE_MODELS, ...LIMITED_MODELS].join(','),
    permissions: 'profile,balance,generate',
    expiry: '30'
  });
  return `https://enter.pollinations.ai/authorize?${params}`;
};

export const parseAuthCallback = () => {
  const hash = window.location.hash.slice(1);
  const params = new URLSearchParams(hash);
  const apiKey = params.get('api_key');
  const error = params.get('error');
  return { apiKey, error };
};
