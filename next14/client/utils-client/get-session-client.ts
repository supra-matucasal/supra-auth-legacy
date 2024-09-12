import { Session } from '../../../shared';

const getSessionClient = async (): Promise<Session | null> => {
  console.log('getSessionsClient');
  try {
    const getSessionRoute = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/session`;

    const response = await fetch(getSessionRoute, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      return {
        access_token: data?.session?.access_token,
        refresh_token: data?.session?.refresh_token,
      };
    }

    throw new Error('Failed to refresh tokens');
  } catch (error) {
    console.error('Error refreshing tokens:', error);
    return null;
  }
};

export { getSessionClient };
