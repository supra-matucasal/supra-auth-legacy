
export const base64Url = (str: string): string => {
  return str.replace(/-/g, '+').replace(/_/g, '/');
};

export const base64Decode = (str: string): string => {
  return Buffer.from(str, 'base64').toString('utf-8');
};

export const parseJwt = (token: string): any => {
  if (!token) return null;
  const [, payload] = token.split('.');
  if (!payload) return null;

  const decodedPayload = base64Decode(base64Url(payload));
  try {
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Failed to parse JWT payload:', error);
    return null;
  }
};

