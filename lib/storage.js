// localStorage utilities with safety checks

export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(`genzee:${key}`, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error('Storage save error:', e);
    return false;
  }
};

export const loadFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(`genzee:${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error('Storage load error:', e);
    return defaultValue;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(`genzee:${key}`);
    return true;
  } catch (e) {
    console.error('Storage remove error:', e);
    return false;
  }
};

// Specific helpers
export const saveTheme = (theme) => saveToStorage('theme', theme);
export const loadTheme = () => loadFromStorage('theme', 'dark');

export const saveAPIKey = (key) => saveToStorage('api_key', key);
export const loadAPIKey = () => loadFromStorage('api_key');
export const clearAPIKey = () => removeFromStorage('api_key');

export const markAsRegistered = () => saveToStorage('registered', true);
export const isRegistered = () => loadFromStorage('registered', false);

export const saveGenerateCount = (model, count) => {
  const counts = loadFromStorage('generate_counts', {});
  counts[model] = count;
  saveToStorage('generate_counts', counts);
};
export const getGenerateCount = (model) => {
  const counts = loadFromStorage('generate_counts', {});
  return counts[model] || 0;
};

export const saveHistory = (item) => {
  const history = loadFromStorage('history', []);
  history.unshift({ ...item, id: Date.now() });
  saveToStorage('history', history);
  return history.length;
};
export const getHistory = () => loadFromStorage('history', []);
export const clearHistory = () => removeFromStorage('history');

export const savePreferences = (prefs) => saveToStorage('prefs', prefs);
export const loadPreferences = () => loadFromStorage('prefs', {
  hideHistoryWarning: false,
  saveLogin: true,
});

export const incrementUsage = (model) => {
  const usage = loadFromStorage('usage', { total: 0, byModel: {} });
  usage.total += 1;
  usage.byModel[model] = (usage.byModel[model] || 0) + 1;
  saveToStorage('usage', usage);
  return usage;
};
export const getUsage = () => loadFromStorage('usage', { total: 0, byModel: {} });
