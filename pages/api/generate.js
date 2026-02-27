export default async function handler(req, res) {
  const { prompt, width = 1024, height = 1024, seed, model = 'zimage' } = req.query;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt required' });
  }
  
  // 🔐 API Key dari Vercel Environment Variables
  const API_KEY = process.env.POLLINATIONS_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'POLLINATIONS_KEY not configured' });
  }
  
  try {
    const randomSeed = seed || Math.floor(Math.random() * 999999);
    
    // ✅ URL LENGKAP: endpoint + model + key
    const imageUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${randomSeed}&model=${model}&nologo=true&key=${API_KEY}`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    
    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'AI-Generator/1.0' }
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error text');
      
      try {
        const errJson = JSON.parse(errorText);
        if (errJson.error?.message) {
          return res.status(response.status).json({ 
            error: errJson.error.message,
            code: errJson.error.code 
          });
        }
      } catch {}
      
      if (response.status === 401) return res.status(401).json({ error: 'Invalid API key' });
      if (response.status === 402) return res.status(402).json({ error: 'Insufficient pollen balance' });
      if (response.status === 400) return res.status(400).json({ error: 'Invalid parameters' });
      if (response.status >= 500) return res.status(503).json({ error: 'Server unavailable' });
      
      throw new Error(`API ${response.status}: ${errorText.slice(0, 200)}`);
    }
    
    const buffer = await response.arrayBuffer();
    
    if (buffer.byteLength < 1000) {
      const text = new TextDecoder().decode(buffer);
      if (text.toLowerCase().includes('error')) {
        return res.status(500).json({ error: 'API returned error', details: text.slice(0, 200) });
      }
    }
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(Buffer.from(buffer));
    
  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Timeout: Pollinations took too long' });
    }
    return res.status(500).json({ error: 'Failed to generate', details: error.message });
  }
}
