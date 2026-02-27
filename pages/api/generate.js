export default async function handler(req, res) {
  const { prompt, width = 1024, height = 1024, seed } = req.query;
  
  // 🔐 Ganti dengan API KEY lu dari enter.pollinations.ai
  // Pastikan pakai sk_ (secret key) untuk server-side!
  const POLLINATIONS_KEY = process.env.POLLINATIONS_KEY || 'pk_pzzzpBDHbpUyct83';
  
  console.log('📥 Request:', { prompt, width, height, seed });
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt required' });
  }
  
  try {
    const randomSeed = seed || Math.floor(Math.random() * 999999);
    
    // 🆕 PAKAI ENDPOINT BARU: gen.pollinations.ai
    const imageUrl = `https://gen.pollinations.ai/image/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${randomSeed}&nologo=true`;
    
    console.log('🔗 Fetching:', imageUrl);
    
    // Tambah timeout 60 detik
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    
    const response = await fetch(imageUrl, {
      signal: controller.signal,
      headers: {
        // 🔐 AUTHENTICATION WAJIB!
        'Authorization': `Bearer ${POLLINATIONS_KEY}`,
        'User-Agent': 'AI-Generator/1.0'
      }
    });
    
    clearTimeout(timeout);
    
    console.log('📡 Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error text');
      console.error('❌ API Error:', response.status, errorText);
      
      // Handle specific errors
      if (response.status === 401) {
        return res.status(401).json({ error: 'Invalid API key' });
      }
      if (response.status === 402) {
        return res.status(402).json({ error: 'Insufficient pollen balance' });
      }
      if (response.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded' });
      }
      
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }
    
    const buffer = await response.arrayBuffer();
    console.log('📊 Image size:', buffer.byteLength, 'bytes');
    
    // Cek kalau gambar terlalu kecil (mungkin error)
    if (buffer.byteLength < 1000) {
      console.warn('⚠️ Response too small, might be error');
    }
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(Buffer.from(buffer));
    
  } catch (error) {
    console.error('💥 Error:', error.message);
    
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Timeout: API took too long' });
    }
    
    return res.status(500).json({ 
      error: 'Failed to generate image', 
      details: error.message 
    });
  }
}
