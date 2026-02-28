// Simple translator using Google Translate embed

export const GOOGLE_TRANSLATE_URL = 'https://translate.google.com/translate?hl=en&sl=auto&tl={{LANG}}&u={{URL}}';

export const translatePage = (targetLang) => {
  // Create Google Translate iframe overlay
  const iframe = document.createElement('iframe');
  iframe.src = GOOGLE_TRANSLATE_URL.replace('{{LANG}}', targetLang).replace('{{URL}}', encodeURIComponent(window.location.href));
  iframe.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;border:none;z-index:9999;';
  document.body.appendChild(iframe);
  
  // Add close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕ Close Translator';
  closeBtn.style.cssText = 'position:fixed;top:10px;right:10px;z-index:10000;padding:10px 20px;';
  closeBtn.onclick = () => iframe.remove();
  document.body.appendChild(closeBtn);
};

export const detectUserLanguage = async () => {
  // Try navigator.language first
  const navLang = navigator.language?.split('-')[0] || 'en';
  
  // Fallback to IP-based detection
  try {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    const ipLangMap = { ID: 'id', MY: 'ms', SG: 'en', PH: 'en', TH: 'th', VN: 'vi' };
    return ipLangMap[data.country_code] || navLang;
  } catch {
    return navLang;
  }
};
