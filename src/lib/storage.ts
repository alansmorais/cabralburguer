// Safe localStorage wrapper to prevent application crash in sandboxed/iframe environments
const memoryStore: Record<string, string> = {};

const getLocalStorage = (): Storage | null => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch (e) {
    console.warn('Failed to access window.localStorage.', e);
  }
  return null;
};

export const safeStorage = {
  getItem(key: string): string | null {
    try {
      const storage = getLocalStorage();
      if (storage) {
        return storage.getItem(key);
      }
    } catch (e) {
      console.warn(`localStorage.getItem failed for key "${key}". Falling back to memory storage.`, e);
    }
    return memoryStore[key] || null;
  },

  setItem(key: string, value: string): void {
    try {
      const storage = getLocalStorage();
      if (storage) {
        storage.setItem(key, value);
        return;
      }
    } catch (e) {
      console.warn(`localStorage.setItem failed for key "${key}". Falling back to memory storage.`, e);
    }
    memoryStore[key] = value;
  },

  removeItem(key: string): void {
    try {
      const storage = getLocalStorage();
      if (storage) {
        storage.removeItem(key);
        return;
      }
    } catch (e) {
      console.warn(`localStorage.removeItem failed for key "${key}". Falling back to memory storage.`, e);
    }
    delete memoryStore[key];
  }
};
