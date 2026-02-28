// Simple device/IP fingerprinting (client-side only)

export const getDeviceFingerprint = () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 200; canvas.height = 50;
  ctx.fillStyle = '#f60';
  ctx.fillRect(0, 0, 200, 50);
  ctx.fillStyle = '#069';
  ctx.font = '15pt Arial';
  ctx.fillText('GENZEE', 20, 30);
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    `${screen.width}x${screen.height}`,
    canvas.toDataURL()
  ].join('|');
  
  // Simple hash
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    hash = ((hash << 5) - hash) + fingerprint.charCodeAt(i);
    hash |= 0;
  }
  return `dev_${Math.abs(hash).toString(36)}`;
};

export const isSameDevice = (storedFingerprint) => {
  return storedFingerprint === getDeviceFingerprint();
};

export const getApproximateLocation = async () => {
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    return { country: data.country_name, city: data.city };
  } catch {
    return { country: 'Unknown', city: 'Unknown' };
  }
};

export const suggestLanguage = async () => {
  const loc = await getApproximateLocation();
  const langMap = {
    'Indonesia': 'id', 'United States': 'en', 'Malaysia': 'ms',
    'Singapore': 'en', 'Philippines': 'en', 'Thailand': 'th'
  };
  return langMap[loc.country] || 'en';
};
