import { NextApiRequest, NextApiResponse } from 'next';
//import { getSession } from '../auth-utils-server';
import { handleCallbackNextApi, handleLoginNextApi, handleTokenNextApi } from '../handlers';


export function createAuthRouterNextApi() {
  return async function authRouter(req: NextApiRequest, res: NextApiResponse) {
    const pathname = req.url;
    const route = pathname ? pathname.split('/').pop()?.split('?')[0] : undefined;
    switch (req.method) {
      case 'GET':
        switch (route) {
          case 'login':
            return handleLoginNextApi(req, res);
          case 'callback':
            return handleCallbackNextApi(req, res);
          case 'token':
            return handleTokenNextApi(req, res);
          default:
            return res.status(400).json({ error: 'Invalid route' });
        }
      case 'POST':
        switch (route) {
          default:
            return res.status(400).json({ error: 'Invalid route' });
        }
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  };
}
