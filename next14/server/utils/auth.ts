import { SESSION_NAME, SESSION_COOKIE_MAX_AGE } from '../../../authConfig';
import crypto from 'crypto';
import { getCookie, setCookie } from './cookies';
import { v4 as uuidv4 } from 'uuid';
import { NextApiRequest, NextApiResponse } from 'next';


export const getSession = (): { access_token: string; email: string; refresh_token: string; } | undefined => {
  console.log('Getting the session from getSession()...');
  const cookieValue = getCookie(SESSION_NAME || 'session');
  if (cookieValue === '') {
    // If cookieValue is an empty object, return undefined
    return undefined;
  }
  //let isTokenRefreshing: any = false; // Track token refresh status
  const { access_token, email, refresh_token } = JSON.parse(cookieValue || '');
  console.log('Result of getting the session:', { access_token, email, refresh_token });
  return { access_token, email, refresh_token };
};

export const getSessionWithRequest = (req: NextApiRequest, res: NextApiResponse): { access_token: string; email: string; refresh_token: string; } | undefined => {
  const cookieValue = req.cookies[SESSION_NAME || 'session'];


  console.log('cookieValue', cookieValue);
  if (cookieValue === '' || cookieValue === undefined) {
    console.log('cookieValue is empty');
    // If cookieValue is an empty object, return undefined
    return undefined;
  }
  //let isTokenRefreshing: any = false; // Track token refresh status
  const { access_token, email, refresh_token } = JSON.parse(cookieValue || '');
  return { access_token, email, refresh_token };
  //return res.status(200).json({ session: { access_token, email, refresh_token } });
}

export const getTempCode = (): string | any => {
  const cookieValue = getCookie(SESSION_NAME);
  if (cookieValue === '') {
    // If cookieValue is an empty object, return undefined
    return undefined;
  }

  const session = cookieValue || null;
  return session;
};

export const generateRandomState = (): string => {
  return uuidv4();
}

export const saveSession = (session: { access_token: string, refresh_token: string }) => {
  const cookieValue = JSON.stringify(session);
  setCookie(SESSION_NAME, cookieValue, 'lax', SESSION_COOKIE_MAX_AGE);
}

