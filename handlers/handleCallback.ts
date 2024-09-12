import { NextRequest, NextResponse } from "next/server";
import { SUPRA_AUTH_CLIENT_BASE_URL, REDIRECT_URI, SESSION_NAME, SUPRA_AUTH_CLIENT_ID, SUPRA_AUTH_CLIENT_SECRET, TOKEN_FETCH_URL } from '../authConfig';
import { NextApiRequest, NextApiResponse } from "next";
import cookie from 'cookie';



export async function handleCallbackNextApi(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req;
  const code = query.code as string;
  const state = query.state as string;
  const device = query.device as string;

  if (!code || !state || !device) {
    return res.status(400).json({ error: 'code, state and device are required' });
  }


  
  // const agent = req.headers['user-agent'] || 'Unknown';
  // const ip = req.headers['x-forwarded-for']  || req.headers['x-real-ip'] || 'Unknown';

  const { headers } = req;
  const agent = headers['user-agent'] || 'Unknown';
  const ip = headers['x-forwarded-for'] || headers['x-real-ip'] || 'Unknown';

  const referer = new URL(SUPRA_AUTH_CLIENT_BASE_URL || '').origin
  const client_id = SUPRA_AUTH_CLIENT_ID || '';
  const client_secret = SUPRA_AUTH_CLIENT_SECRET || '';

  const headersObj: any = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': `${referer}`,
    'User-Agent': agent || '',
    'Real-Ip': ip || '',
    'Device': device,
  }

  // const headerObj: any = {
  //   'Content-Type': 'application/x-www-form-urlencoded',
  //   'Referer': `${referer}`,
  //   'User-Agent': agent || '',
  //   'Real-Ip': ip || '',
  // };


  console.log('Trying to send this Headers in /callback: ', headersObj);

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

  console.log('Result after calling /token: ', { access_token, email, refresh_token });

  if (access_token) {
    const sessionData = JSON.stringify({ access_token, email, refresh_token })

    // const res = NextResponse.redirect(`${SUPRA_AUTH_CLIENT_BASE_URL}/`);
    // res.cookies.set({
    //   name: SESSION_NAME || 'session',
    //   value: sessionData,
    //   httpOnly: process.env.APP_ENV !== 'development',
    //   secure: process.env.APP_ENV !== 'development',
    //   sameSite: 'lax',
    //   path: '/',
    //   maxAge: 3600,
    // });

    //const cookieSession = `${SESSION_NAME || 'session'}=${sessionData}; Path=/; HttpOnly; Max-Age=${3600}; SameSite=Lax; Secure=${process.env.APP_ENV !== 'development'}`;
    //res.setHeader('Set-Cookie', cookieSession);
  
    //const cookieState = `state=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
    //res.setHeader('Set-Cookie', cookieState);

    const cookieSession = cookie.serialize(SESSION_NAME || 'session', sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 3600,
      sameSite: 'lax',
      path: '/',
    });

    const cookieState = cookie.serialize('state', '', {
      maxAge: 0,
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    res.setHeader('Set-Cookie', [cookieSession, cookieState]);

    // const res = NextResponse.redirect(`${SUPRA_AUTH_CLIENT_BASE_URL}/`);
    res.redirect(`${SUPRA_AUTH_CLIENT_BASE_URL}/`);
    return res;
  }

  console.error('Access token missing in response');

  return res.status(400).json({ error: 'Access token missing' });

}
