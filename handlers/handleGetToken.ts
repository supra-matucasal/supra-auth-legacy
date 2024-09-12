import { NextApiRequest, NextApiResponse } from "next";
import { SESSION_NAME } from '../authConfig';
import { parse } from 'cookie';

export async function handleGetToken(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parse(req.headers.cookie || '');
  let session: any = cookies[`${SESSION_NAME}`];
  session = JSON.parse(session)
  try {
    return res.status(200).json(session);
  } catch (error) {
    console.error("Failed to fetch token:", error);
    return res.status(400).json({ error: "Failed to fetch token" });
  }
}