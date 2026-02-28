// This is optional - most requests go direct from frontend
// Keep this for fallback or advanced features

export default async function handler(req, res) {
  const { prompt, model, width, height, seed, apiKey } = req.query;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt required' });
  }

  try {
    const params = new URLSearchParams({ width, height, seed, model, nologo: 'true' });
    if (apiKey) params.append('key', apiKey);
    
    const imageUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?${params}`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    
    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'GENZEE/1.0' }
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      const text = await response.text().catch(() => '');
      return res.status(response.status).json({ error: text.slice(0, 200) });
    }
    
    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(Buffer.from(buffer));
    
  } catch (error) {
    console.error('API Error:', error);
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Timeout: Server took too long' });
    }
    res.status(500).json({ error: 'Failed to generate image' });
  }
}
