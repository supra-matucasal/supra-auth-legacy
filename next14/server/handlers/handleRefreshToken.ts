import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { setCookie } from "../utils";
import { REFRESH_TOKEN_URL, SESSION_COOKIE_MAX_AGE, SESSION_NAME, SUPRA_AUTH_CLIENT_BASE_URL } from '../../../authConfig';

const getHeaders: any = (req: any, bearerToken: any, agent: any, ip: any) => ({
  'Referer': SUPRA_AUTH_CLIENT_BASE_URL,
  'Authorization': `Bearer ${bearerToken}`,
  'User-Agent': agent || '',
  'Real-Ip': ip || '',
});

const handleTokenResponse = async (response: any) => {
  const { access_token, refresh_token } = await response.json();
  const sessionData = JSON.stringify({ access_token, refresh_token });
  setCookie(SESSION_NAME, sessionData, 'lax', SESSION_COOKIE_MAX_AGE);
  const res = NextResponse.json({ access_token, refresh_token });
  res.cookies.set({
    name: SESSION_NAME || 'session',
    value: sessionData,
    httpOnly: process.env.APP_ENV !== 'development',
    secure: process.env.APP_ENV !== 'development',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_COOKIE_MAX_AGE,
  });

  return res;
};

export async function handleRefreshToken(req: NextRequest, res: NextResponse) {
  const APP_URL: any = SUPRA_AUTH_CLIENT_BASE_URL;
  const { headers } = req;
  const authorization = headers.get('Authorization');
  const bearerToken = authorization?.replace('Bearer ', '');


  let agent = headers.get('user-agent') || 'Unknown';
  const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'Unknown';
  const redirectUrl = new URL(APP_URL);

  try {
    const response = await fetch(REFRESH_TOKEN_URL, {
      method: 'POST',
      headers: getHeaders(req, bearerToken, agent, ip),
      body: JSON.stringify({ redirectLogoutUrl: redirectUrl }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    return await handleTokenResponse(response);
  } catch (error) {
    console.error("Error during token generation:", error);
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
  }
}