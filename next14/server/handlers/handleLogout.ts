import { parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../utils";
import { removeCookie } from "../utils";
import { LOGOUT_URL, SESSION_NAME, SUPRA_AUTH_CLIENT_BASE_URL, SUPRA_AUTH_CLIENT_ID } from '../../../authConfig';


export async function handleLogout(req: NextRequest, res: NextResponse) {
  const client_id = SUPRA_AUTH_CLIENT_ID;
  const redirect_logout_url = SUPRA_AUTH_CLIENT_BASE_URL;

  const session: any = getSession();
  if (!session || client_id === undefined || redirect_logout_url === undefined) {
    return NextResponse.redirect(`${redirect_logout_url}`, { status: 302 });
  }
  const { headers } = req;
  const agent = headers.get('user-agent') || 'Unknown';
  const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'Unknown';
  const referer = new URL(redirect_logout_url || '').origin
  const headerObj = {
    //'Content-Type': 'application/x-www-form-urlencoded',
    'Referer': `${referer}`,
    'Authorization': `Bearer ${session.access_token}`,
    'User-Agent': agent || '',
    'Real-Ip': ip || '',
  }

  console.log('Trying to logout with this session: ', session)

  await fetch(LOGOUT_URL, {
    method: 'POST',
    headers: headerObj,
    body: JSON.stringify({ redirectLogoutUrl: redirect_logout_url }),
    //credentials: 'include',
  });

  removeCookie(SESSION_NAME);

  return new NextResponse(
    `<script>
      window.location.reload();
      setTimeout(function() {
        window.location.href = "${redirect_logout_url}";
      }, 100);
    </script>`,
    {
      headers: { 'Content-Type': 'text/html' },
      status: 200,
    }
  );

}