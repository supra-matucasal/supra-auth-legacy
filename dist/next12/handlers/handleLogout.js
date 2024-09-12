"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLogoutNextApi = void 0;
const cookie_1 = require("cookie");
const authConfig_1 = require("../../authConfig");
function handleLogoutNextApi(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client_id = authConfig_1.SUPRA_AUTH_CLIENT_ID;
            const redirect_logout_url = authConfig_1.SUPRA_AUTH_CLIENT_BASE_URL;
            const cookies = (0, cookie_1.parse)(req.headers.cookie || '');
            let session = cookies[`${authConfig_1.SESSION_NAME}`];
            if (!session || client_id === undefined || redirect_logout_url === undefined) {
                return res.status(400).json({ error: 'Invalid route' });
            }
            session = JSON.parse(session);
            const agent = req.headers['user-agent'] || 'Unknown';
            const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'Unknown';
            const referer = new URL(redirect_logout_url || '').origin;
            const headersObj = {
                //'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': `${referer}`,
                'Authorization': `Bearer ${session.access_token}`,
                'User-Agent': agent || '',
                'Real-Ip': ip || '',
            };
            yield fetch(authConfig_1.LOGOUT_URL, {
                method: 'POST',
                headers: headersObj,
                body: JSON.stringify({ redirectLogoutUrl: redirect_logout_url }),
                // credentials: 'include',
            });
            res.setHeader('Set-Cookie', `${authConfig_1.SESSION_NAME}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`);
            return res.status(200).send(`
    <script>
      window.location.reload();
      setTimeout(function() {
        window.location.href = "${redirect_logout_url}";
      }, 100);
    </script>
  `);
        }
        catch (error) {
            console.log("error----------------------->", error);
        }
    });
}
exports.handleLogoutNextApi = handleLogoutNextApi;
