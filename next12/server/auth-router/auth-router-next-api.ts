import { NextApiRequest, NextApiResponse } from 'next';
import { handleCallbackNextApi, handleLoginNextApi, handleTokenNextApi, handleLogoutNextApi, handleMeNextApi, handleSessionNextApi, handleRemoveCookieNextApi, handleRefreshTokenNextApi } from '../handlers';


export function createAuthRouterNextApi() {
  return async function authRouter(req: NextApiRequest, res: NextApiResponse) {
    const pathname = req.url;
    const route = pathname ? pathname.split('/').pop()?.split('?')[0] : undefined;
    console.log('route in createAuthRouterNextApi', route);

    switch (req.method) {
      case 'GET':
        switch (route) {
          case 'login':
            return handleLoginNextApi(req, res);
          case 'callback':
            return handleCallbackNextApi(req, res);
          case 'logout':
            console.log('Trying to logut')
            return handleLogoutNextApi(req, res);
          case 'token':
            return handleTokenNextApi(req, res);
          case 'me':
            return handleMeNextApi(req, res);
          case 'session':
            return handleSessionNextApi(req, res);
          case 'remove-token':
            return handleRemoveCookieNextApi(req, res);
          default:
            return res.status(400).json({ error: 'Invalid route' });
        }
      case 'POST':
        switch (route) {
          case 'refresh-token':
            return handleRefreshTokenNextApi(req, res);
          default:
            return res.status(400).json({ error: 'Invalid route' });
        }
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  };
}
