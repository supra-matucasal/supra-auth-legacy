import { NextRequest, NextResponse } from "next/server";
import { removeCookie } from "../utils";
import { SUPRA_AUTH_CLIENT_BASE_URL, REDIRECT_URI, SESSION_NAME, SUPRA_AUTH_CLIENT_ID, SUPRA_AUTH_CLIENT_SECRET, TOKEN_FETCH_URL } from '../../../authConfig';
import { NextApiRequest, NextApiResponse } from "next";
import cookie from 'cookie';


export async function handleCallback(req: NextRequest, res: NextResponse) {

  console.log('Callback route initiated...');

  const { searchParams } = req.nextUrl;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const device = searchParams.get('device');

  if (!code || !state || !device) {
    return new NextResponse(JSON.stringify({ error: 'code, state and device are required' }), { status: 400 });
  }

  //TODO: Fix state verification
  // const cookieState = getCookie('state');
  // if (!cookieState) {
  //   console.error('No state stored in cookies');
  //   return new NextResponse(JSON.stringify({ error: 'State not stored in cookies' }), { status: 400 });
  // }

  // if (!verifyState(cookieState) || !cookieState.startsWith(state)) {
  //   console.error('Invalid state');
  //   return new NextResponse(JSON.stringify({ error: 'Invalid state' }), { status: 400 });
  // }



  const { headers } = req;
  const agent = headers.get('user-agent') ?? 'Unknown';
  const ip = headers.get('x-forwarded-for') ?? headers.get('x-real-ip') ?? 'Unknown';

  const referer = new URL(SUPRA_AUTH_CLIENT_BASE_URL || '').origin
  const client_id = SUPRA_AUTH_CLIENT_ID || '';
  const client_secret = SUPRA_AUTH_CLIENT_SECRET || '';

  const headersObj = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': `${referer}`,
    'User-Agent': agent,
    'Real-Ip': ip,
    'Device': device,
  }

  console.log('Trying to send this Headers: ', headersObj);

  const params = new URLSearchParams({
    code,
    client_id,
    redirect_uri: REDIRECT_URI,
    client_secret,
    grant_type: 'authorization_code',
  });

  const response = await fetch(TOKEN_FETCH_URL, {
    method: 'POST',
    headers: headersObj,
    body: params,
    credentials: 'include',
  });

  if (response.status !== 200) {
    console.error('Failed to fetch token');
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch token' }), { status: 400 });
  }

  const { access_token, email, refresh_token } = await response.json();
  if (access_token) {
    const sessionData = JSON.stringify({ access_token, email, refresh_token })

    const res = NextResponse.redirect(`${SUPRA_AUTH_CLIENT_BASE_URL}/`);
    res.cookies.set({
      name: SESSION_NAME || 'session',
      value: sessionData,
      httpOnly: process.env.APP_ENV !== 'development',
      secure: process.env.APP_ENV !== 'development',
      sameSite: 'lax',
      path: '/',
      maxAge: 3600,
    });

    removeCookie('state');

    return res;
  }

  console.error('Access token missing in response');

  return new NextResponse(JSON.stringify({ error: 'Access token missing' }), { status: 400 });

}

