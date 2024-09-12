import { NextApiRequest, NextApiResponse } from "next";
import { SESSION_NAME } from '../../../authConfig';


export async function handleSessionNextApi(req: NextApiRequest, res: NextApiResponse) {
  const cookieValue = req.cookies[SESSION_NAME || 'session'];
  if (cookieValue === '' || cookieValue === undefined) {
    // If cookieValue is an empty object, return undefined
    return undefined;
  }
  //let isTokenRefreshing: any = false; // Track token refresh status
  const { access_token, email, refresh_token } = JSON.parse(cookieValue || '');
  //return { access_token, email, refresh_token };
  return res.status(200).json({ session: { access_token, email, refresh_token } });
}