export const setInStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

export const getFromStorage = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const deleteFromStorage = (key: string) => {
  localStorage.removeItem(key);
};

export const clearStorage = () => {
  localStorage.clear();
};
