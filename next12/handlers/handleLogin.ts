import { SUPRA_AUTH_CLIENT_BASE_URL, REDIRECT_URI, SESSION_COOKIE_MAX_AGE, SESSION_NAME, SUPRA_AUTH_CLIENT_ID, SUPRA_AUTH_ISSUER_BASE_URL } from '../../authConfig';
import { NextApiRequest, NextApiResponse } from "next";
import cookie from 'cookie';
import { v4 as uuidv4 } from 'uuid';


export async function handleLoginNextApi(req: NextApiRequest, res: NextApiResponse) {
  //If we already have a session-cookie we should redirect to the callback URL
  const cookieName = SESSION_NAME || 'session';
  if (cookieName) {
    const cookieValue = req.cookies[cookieName] || '';

    const { access_token } = JSON.parse(cookieValue || '{}');

    if (access_token) {
      return res.redirect(`${SUPRA_AUTH_CLIENT_BASE_URL}`);
    }
  }

  // Generate and sign the state, then store it in a cookie
  const state = uuidv4();

  //setting the cookie
  //const cookie = `state=${state}; Path=/; HttpOnly; Max-Age=${SESSION_COOKIE_MAX_AGE}; SameSite=Lax`;
  
  const cookieValue = cookie.serialize('state', state, {
    httpOnly: true,
    maxAge: SESSION_COOKIE_MAX_AGE,
    sameSite: 'lax',
    path: '/',
  });

    
  res.setHeader('Set-Cookie', cookieValue);

  const redirectUrl = `${SUPRA_AUTH_ISSUER_BASE_URL}/api/auth/authorize?client_id=${SUPRA_AUTH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}`;

  return res.redirect(redirectUrl);
}