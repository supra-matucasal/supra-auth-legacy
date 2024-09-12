import { parse, serialize } from 'cookie';
import { NextApiRequest, NextApiResponse } from "next";
import { SESSION_NAME } from '../../../authConfig';


export async function handleRemoveCookieNextApi(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parse(req.headers.cookie || '');
  let session: any = cookies[`${SESSION_NAME}`];

  if (!session) {
    return res.status(400).json({ error: 'Session not found' });
  }

  try {
    session = JSON.parse(session);
    if (session) {
      res.setHeader('Set-Cookie', serialize(SESSION_NAME, '', {
        path: '/',
        expires: new Date(0), // Set expiration to a past date
        httpOnly: true,       // Ensure it's HttpOnly
        secure: process.env.NODE_ENV === 'production', // Secure in production
        sameSite: 'lax'
      }));
      return res.status(200).json(session);
    } else {
      return res.status(200).json({});

    }
    // Remove the session cookie by setting its expiration to a past date
  } catch (error) {
    console.error("Failed to fetch token:", error);
    return res.status(400).json({ error: "Failed to fetch token" });
  }
}