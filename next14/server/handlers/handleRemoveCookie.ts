import { parse, serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { SESSION_NAME } from '../../../authConfig';
import { getCookie, removeCookie } from '../utils';


export async function handleRemoveCookie(req: NextRequest, res: NextResponse) {
  const cookieName = SESSION_NAME || 'session';

  const cookieValue = getCookie(cookieName)
  if (!cookieValue) {
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch token' }), { status: 400 });
  }


  try {

    if (cookieValue) {
      removeCookie(cookieName);
      return new NextResponse(cookieValue, { status: 200 });
    } else {
      return new NextResponse(JSON.stringify({ error: 'Failed to remove token' }), { status: 400 });

    }
    // Remove the session cookie by setting its expiration to a past date
  } catch (error) {
    console.error("Failed to fetch token:", error);
    return NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
  }
}