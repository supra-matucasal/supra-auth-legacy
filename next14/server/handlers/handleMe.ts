import { parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { ME_URL, SESSION_NAME, SUPRA_AUTH_CLIENT_BASE_URL } from '../../../authConfig';
const getHeaders: any = (bearerToken: any, agent: any, ip: any) => ({
  'Referer': SUPRA_AUTH_CLIENT_BASE_URL,
  'Authorization': `Bearer ${bearerToken}`,
  'User-Agent': agent || '',
  'Real-Ip': ip || '',
  'device': uuidv4()
});

const handleMeResponse = async (response: any) => {
  const user = await response.json();
  const res = NextResponse.json(user);
  return res;
};

export async function handleMe(req: NextRequest, res: NextResponse) {
  const { headers } = req;
  const authorization = headers.get('Authorization');
  const bearerToken = authorization?.replace('Bearer ', '');


  let agent = headers.get('user-agent') || 'Unknown';
  const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'Unknown';
  // const redirectUrl = new URL(APP_URL);
  try {
    console.log("getHeaders(bearerToken, agent, ip)-------------------->", getHeaders(bearerToken, agent, ip))
    const response = await fetch(ME_URL, {
      method: 'GET',
      headers: getHeaders(bearerToken, agent, ip),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to Fetch Me');
    }
    return await handleMeResponse(response);
  } catch (error) {
    console.error("Error during Me Fetch:", error);
    return NextResponse.json({ error: 'Failed to Fetch Me' }, { status: 500 });
  }
}
