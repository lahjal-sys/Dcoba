// Ini SERVERLESS FUNCTION yang jadi PROXY
// Request dari browser lu → Vercel Server → Pollinations → Vercel → Browser lu

export default async function handler(req, res) {
  const { prompt, width = 1024, height = 1024, seed } = req.query;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt required' });
  }
  
  try {
    // Server Vercel request ke Pollinations (TIDAK DIBLOKIR ISP!)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&seed=${seed || Math.floor(Math.random() * 999999)}&nologo=true`;
    
    // Fetch gambar dari Pollinations
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    
    // Dapat image sebagai buffer
    const buffer = await response.arrayBuffer();
    
    // Kirim ke browser lu
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(Buffer.from(buffer));
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
}
