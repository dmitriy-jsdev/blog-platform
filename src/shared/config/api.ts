const normalizeApiBaseUrl = (value?: string): string => {
  const trimmed = value?.trim().replace(/\/+$/, '');
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (!trimmed) {
    if (isDevelopment) {
      return 'http://localhost:3001/api';
    }

    throw new Error(
      'REACT_APP_API_BASE_URL is required for production builds.',
    );
  }

  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

export const API_BASE_URL = normalizeApiBaseUrl(
  process.env.REACT_APP_API_BASE_URL,
);

export const ASSETS_BASE_URL = API_BASE_URL.replace(/\/api$/, '');
export const DEFAULT_AVATAR_URL = `${ASSETS_BASE_URL}/images/avatars/default-avatar.png`;
