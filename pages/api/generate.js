export default async function handler(req, res) {
  const { prompt } = req.query;
  const OPENROUTER_KEY = process.env.OPENROUTER_KEY || '9d3be131ec04575ed0f15ed486d9a8ce6497a3361fe6053726c1bc6736c548cd';
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://your-vercel-app.vercel.app', // required by OpenRouter
        'X-Title': 'AI Image Generator'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview', // free model [[60]]
        messages: [{ role: 'user', content: prompt }],
        modalities: ['text', 'image']
      })
    });
    
    const data = await response.json();
    const imageUrl = data.choices[0]?.message?.images?.[0]?.image_url;
    
    if (!imageUrl) throw new Error('No image in response');
    
    // Redirect ke URL gambar atau fetch & proxy
    res.redirect(imageUrl);
    
  } catch (error) {
    res.status(500).json({ error: 'Failed', details: error.message });
  }
}
