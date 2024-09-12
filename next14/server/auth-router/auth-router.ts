// src/server/auth-router.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleCallback, handleLogin, handleLogout, handleRefreshToken, handleRemoveCookie, handleToken, handleMe } from '../handlers';
import { getSession } from '../utils';

export function createAuthRouter() {
  return async function authRouter(req: NextRequest, res: NextResponse) {
    const pathname = req.nextUrl.pathname;
    const route = pathname.split('/').pop();

    switch (req.method) {
      case 'GET':
        switch (route) {
          case 'login':
            return handleLogin(req, res);
          case 'callback':
            return handleCallback(req, res);
          case 'logout':
            return handleLogout(req, res);
          case 'token':
            return handleToken(req, res);
          case 'me':
            return handleMe(req, res);
          case 'remove-token':
            return handleRemoveCookie(req, res);
          case 'session':
            return new NextResponse(JSON.stringify({ session: getSession() }), { status: 200 });
          default:
            return new NextResponse(JSON.stringify({ error: 'Invalid route' }), { status: 400 });
        }
      case 'POST':
        switch (route) {
          case 'refresh-token':
            return handleRefreshToken(req, res);
          default:
            return new NextResponse(JSON.stringify({ error: 'Invalid route' }), { status: 400 });
        }
      default:
        return new NextResponse(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }
  };
}
