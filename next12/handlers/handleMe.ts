import { parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from 'uuid';
import { ME_URL, SESSION_NAME, SUPRA_AUTH_CLIENT_BASE_URL } from '../../authConfig';
const getHeaders: any = (bearerToken: any, agent: any, ip: any) => ({
  'Referer': SUPRA_AUTH_CLIENT_BASE_URL,
  'Authorization': `Bearer ${bearerToken}`,
  'User-Agent': agent || '',
  'Real-Ip': ip || '',
  'device': uuidv4()
});


export async function handleMeNextApi(req: NextApiRequest, res: NextApiResponse) {
  const { headers } = req;
  const cookies = parse(req.headers.cookie || '');
  let session: any = cookies[`${SESSION_NAME}`];
  session = JSON.parse(session)
  let agent = headers['user-agent'] || 'Unknown';
  const ip = headers['x-forwarded-for'] || headers['x-real-ip'] || 'Unknown';
  // const redirectUrl = new URL(APP_URL);
  try {
    const response = await fetch(ME_URL, {
      method: 'GET',
      headers: getHeaders(session.access_token, agent, ip),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to Fetch Me');
    }

    const user = await response.json();
    return res.status(200).json(user);

  } catch (error) {
    console.error("Error during Me Fetch:", error);
    return res.status(400).json({ error: "Failed to fetch user" });
  }
}