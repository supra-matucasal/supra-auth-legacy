import { NextApiRequest, NextApiResponse } from "next";
import { REFRESH_TOKEN_URL, SESSION_COOKIE_MAX_AGE, SESSION_NAME, SUPRA_AUTH_CLIENT_BASE_URL } from '../../../authConfig';

const getHeaders: any = (req: any, bearerToken: any, agent: any, ip: any) => ({
  'Referer': SUPRA_AUTH_CLIENT_BASE_URL,
  'Authorization': `Bearer ${bearerToken}`,
  'User-Agent': agent || '',
  'Real-Ip': ip || '',
});

const handleTokenNextApiResponse = async (response: any, res: any) => {
  const { access_token, refresh_token } = await response.json();
  const sessionData = JSON.stringify({ access_token, refresh_token });
  res.setHeader(
    'Set-Cookie',
    `${SESSION_NAME}=${sessionData}; Path=/; Expires=${SESSION_COOKIE_MAX_AGE}; HttpOnly`
  );
  return res.status(200).json({ access_token, refresh_token });
};




export async function handleRefreshTokenNextApi(req: NextApiRequest, res: NextApiResponse) {
  const APP_URL: any = SUPRA_AUTH_CLIENT_BASE_URL;
  const { headers } = req;
  const authorization = headers['authorization'];
  const bearerToken = authorization?.replace('Bearer ', '');


  let agent = headers['user-agent'] || 'Unknown';
  const ip = headers['x-forwarded-for'] || headers['x-real-ip'] || 'Unknown';
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

    return await handleTokenNextApiResponse(response, res);
  } catch (error) {
    console.error("Error during token generation:", error);
    return res.status(500).json({ error: 'Failed to refresh token' });
  }
}