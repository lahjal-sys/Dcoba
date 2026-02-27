export default async function handler(req, res) {
  const { prompt, width = 1024, height = 1024, seed } = req.query;
  
  // 🔐 API Key dari enter.pollinations.ai (opsional tapi recommended)
  // Kalau gak punya, kosongkan aja - tapi bakal ada watermark & rate limit
  const API_KEY = process.env.POLLINATIONS_KEY || 'sk_l1iaV7VohK5sUTdVbAC6YK9OLE1mpBez';
  
  console.log('📥 Request:', { prompt, width, height, seed, hasKey: !!API_KEY });
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt required' });
  }
  
  try {
    const randomSeed = seed || Math.floor(Math.random() * 999999);
    
    // ✅ PAKAI ENDPOINT YANG BENAR UNTUK GAMBAR:
    let imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${randomSeed}&nologo=true`;
    
    // Tambah API key kalau ada (bisa via query param)
    if (API_KEY) {
      imageUrl += `&key=${API_KEY}`;
      console.log('🔑 Using API key');
    } else {
      console.log('⚠️ No API key - anonymous mode (watermark + rate limit)');
    }
    
    console.log('🔗 Fetching:', imageUrl);
    
    // Timeout 60 detik
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    
    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'AI-Generator/1.0'
        // ❌ JANGAN pakai Authorization header untuk endpoint image - pakai ?key= query param
      }
    });
    
    clearTimeout(timeout);
    
    console.log('📡 Status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error text');
      console.error('❌ API Error:', response.status, errorText);
      
      if (response.status === 401) {
        return res.status(401).json({ error: 'Invalid API key' });
      }
      if (response.status === 402) {
        return res.status(402).json({ error: 'Insufficient pollen balance - top up at enter.pollinations.ai' });
      }
      if (response.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded - wait 15 seconds' });
      }
      
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }
    
    const buffer = await response.arrayBuffer();
    console.log('📊 Image size:', buffer.byteLength, 'bytes');
    
    if (buffer.byteLength < 1000) {
      console.warn('⚠️ Response too small, might be error page');
      // Coba baca sebagai text untuk debug
      const text = new TextDecoder().decode(buffer);
      if (text.includes('error') || text.includes('Error')) {
        return res.status(500).json({ error: 'API returned error page', details: text.slice(0, 200) });
      }
    }
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(Buffer.from(buffer));
    
  } catch (error) {
    console.error('💥 Error:', error.message);
    
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Timeout: Pollinations took too long' });
    }
    
    return res.status(500).json({ 
      error: 'Failed to generate image', 
      details: error.message 
    });
  }
}
