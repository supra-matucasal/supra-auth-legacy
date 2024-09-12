import { Session } from '../../../shared';

const removeSession = async (): Promise<Session | null> => {
  console.log('remove session');
  try {
    const removeSessionRoute = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/remove-token`;

    const response = await fetch(removeSessionRoute, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.ok) {
      console.log("removed Cookies")
    }
    throw new Error('Failed to remove Cookie');
  } catch (error) {
    console.error('Error on remove Cookie:', error);
    return null;
  }
};


export { removeSession };
