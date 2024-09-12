import { NextRequest, NextResponse } from "next/server";
import { generateRandomState } from "../utils";
import { getCookie, setCookie } from "../utils";
import { SUPRA_AUTH_CLIENT_BASE_URL, REDIRECT_URI, SESSION_COOKIE_MAX_AGE, SESSION_NAME, SUPRA_AUTH_CLIENT_ID, SUPRA_AUTH_ISSUER_BASE_URL } from '../../../authConfig';
import { NextApiRequest, NextApiResponse } from "next";
import cookie from 'cookie';

export async function handleLogin(req: NextRequest, res: NextResponse) {
  //If we already have a session-cookie we should redirect to the callback URL
  const cookieName = SESSION_NAME || 'session';
  if (cookieName) {
    const cookieValue = getCookie(cookieName)
    const { access_token } = JSON.parse(cookieValue || '{}');

    if (access_token) {
      return NextResponse.redirect(`${SUPRA_AUTH_CLIENT_BASE_URL}`);
    }
  }

  // Generate and sign the state, then store it in a cookie
  const state = generateRandomState();
  setCookie('state', state, 'lax', SESSION_COOKIE_MAX_AGE);


  const redirectUrl = `${SUPRA_AUTH_ISSUER_BASE_URL}/api/auth/authorize?client_id=${SUPRA_AUTH_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}`;

  return new NextResponse(null, {
    status: 308,
    headers: {
      'Location': redirectUrl,
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
