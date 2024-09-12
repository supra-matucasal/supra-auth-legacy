import { NextApiRequest, NextApiResponse } from "next";
import { SESSION_NAME } from '../../../authConfig';


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