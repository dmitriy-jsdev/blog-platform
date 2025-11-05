export const loadState = <T = unknown>(): T | undefined => {
  try {
    const storedState = localStorage.getItem('state');
    if (!storedState) return undefined;
    return JSON.parse(storedState) as T;
  } catch {
    return undefined;
  }
};

export const saveState = <T>(state: T): void => {
  try {
    localStorage.setItem('state', JSON.stringify(state));
  } catch {}
};
