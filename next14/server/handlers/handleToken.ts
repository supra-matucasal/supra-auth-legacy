import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { getCookie, setCookie } from "../utils";
import cookie from 'cookie';
import { REDIRECT_URI, SESSION_COOKIE_MAX_AGE, SESSION_NAME, SUPRA_AUTH_CLIENT_BASE_URL, SUPRA_AUTH_CLIENT_ID, SUPRA_AUTH_CLIENT_SECRET, TOKEN_FETCH_URL } from '../../../authConfig';

export async function handleToken(req: NextRequest, res: NextResponse) {

  const { headers } = req;
  const agent = headers.get('user-agent') || 'Unknown';
  const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'Unknown';
  const referer = new URL(SUPRA_AUTH_CLIENT_BASE_URL || '').origin

  const client_id = SUPRA_AUTH_CLIENT_ID;
  const client_secret = SUPRA_AUTH_CLIENT_SECRET;

  const codeState = getCookie('tempCode');

  if (!codeState) {
    console.error('No code stored in cookies');
    // Handle missing state (CSRF or other error)
    return new NextResponse(JSON.stringify({ error: 'Cookie of codeState not stored' }), { status: 400 });

  }

  //console.log('Trying to call this: ', `${process.env.SUPRA_AUTH_FRONTEND_URL}/api/auth/token?code=${code}&client_id=${client_id}&redirect_uri=${redirect_url}&client_secret=${client_secret}`)

  // const response = await fetch(`${process.env.AUTH_SSO_SERVER}/api/auth/token?code=${code}&client_id=${client_id}&redirect_uri=${redirect_url}&client_secret=${client_secret}`, {
  //   method: 'POST',
  //   headers: headers(),
  //   credentials: 'include',
  // });
  const params = new URLSearchParams();
  params.append('code', codeState);
  params.append('client_id', client_id || '');
  params.append('redirect_uri', REDIRECT_URI || '');
  params.append('client_secret', client_secret || '');
  params.append('grant_type', 'authorization_code');

  const headerObj = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': `${referer}`,
    'User-Agent': agent || '',
    'Real-Ip': ip || '',
  };

  const response = await fetch(TOKEN_FETCH_URL, {
    method: 'POST',
    headers: headerObj,
    body: params,
    credentials: 'include',
  });

  if (response.status !== 200) {
    return new NextResponse(JSON.stringify({ error: 'Invalid call to token in /callback' }), { status: 400 });
  }

  const { access_token, email, refresh_token } = await response.json();

  if (access_token) {

    const res = new NextResponse(JSON.stringify({ access_token, email, refresh_token }), { status: 200 });
    res.cookies.set({
      name: SESSION_NAME || 'session',
      value: access_token,
      httpOnly: process.env.APP_ENV !== 'development',
      secure: process.env.APP_ENV !== 'development',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_COOKIE_MAX_AGE | 3600,
    });
    return new NextResponse(JSON.stringify({ access_token, email, refresh_token }), { status: 200 });
  }
}
