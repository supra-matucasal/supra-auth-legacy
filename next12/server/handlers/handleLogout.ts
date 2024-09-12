import { parse } from 'cookie';
import { NextApiRequest, NextApiResponse } from "next";
import { LOGOUT_URL, SESSION_NAME, SUPRA_AUTH_CLIENT_BASE_URL, SUPRA_AUTH_CLIENT_ID } from '../../../authConfig';



export async function handleLogoutNextApi(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client_id = SUPRA_AUTH_CLIENT_ID;
    const redirect_logout_url = SUPRA_AUTH_CLIENT_BASE_URL;
    const cookies = parse(req.headers.cookie || '');
    let session: any = cookies[`${SESSION_NAME}`];
    console.log('While logging out, session, client_id, redirect_logout_url, cookies:', { session, client_id, redirect_logout_url, cookies });
    if ( client_id === undefined || redirect_logout_url === undefined) {
      return res.status(400).json({ error: 'Invalid route' });
    }
    //You are already logger out
    if ( !session ){
      return res.status(200).send(`
        <script>
          window.location.reload();
          setTimeout(function() {
            window.location.href = "${redirect_logout_url}";
          }, 100);
        </script>
      `);
    }
    session = JSON.parse(session)
    const agent = req.headers['user-agent'] || 'Unknown';
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'Unknown';
    const referer = new URL(redirect_logout_url || '').origin
    const headersObj: any = {
      //'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': `${referer}`,
      'Authorization': `Bearer ${session.access_token}`,
      'User-Agent': agent || '',
      'Real-Ip': ip || '',
    }


    await fetch(LOGOUT_URL, {
      method: 'POST',
      headers: headersObj,
      body: JSON.stringify({ redirectLogoutUrl: redirect_logout_url }),
      // credentials: 'include',
    });

    res.setHeader(
      'Set-Cookie',
      `${SESSION_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`
    );
    
    return res.status(200).send(`
    <script>
      window.location.reload();
      setTimeout(function() {
        window.location.href = "${redirect_logout_url}";
      }, 100);
    </script>
  `);
  } catch (error) {
    console.log("error----------------------->", error);
  }
}