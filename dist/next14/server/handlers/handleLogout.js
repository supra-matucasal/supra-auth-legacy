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
exports.handleLogout = void 0;
const server_1 = require("next/server");
const utils_1 = require("../utils");
const utils_2 = require("../utils");
const authConfig_1 = require("../../../authConfig");
function handleLogout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const client_id = authConfig_1.SUPRA_AUTH_CLIENT_ID;
        const redirect_logout_url = authConfig_1.SUPRA_AUTH_CLIENT_BASE_URL;
        const session = (0, utils_1.getSession)();
        if (!session || client_id === undefined || redirect_logout_url === undefined) {
            return server_1.NextResponse.redirect(`${redirect_logout_url}`, { status: 302 });
        }
        const { headers } = req;
        const agent = headers.get('user-agent') || 'Unknown';
        const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'Unknown';
        const referer = new URL(redirect_logout_url || '').origin;
        const headerObj = {
            //'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': `${referer}`,
            'Authorization': `Bearer ${session.access_token}`,
            'User-Agent': agent || '',
            'Real-Ip': ip || '',
        };
        console.log('Trying to logout with this session: ', session);
        yield fetch(authConfig_1.LOGOUT_URL, {
            method: 'POST',
            headers: headerObj,
            body: JSON.stringify({ redirectLogoutUrl: redirect_logout_url }),
            //credentials: 'include',
        });
        (0, utils_2.removeCookie)(authConfig_1.SESSION_NAME);
        return new server_1.NextResponse(`<script>
      window.location.reload();
      setTimeout(function() {
        window.location.href = "${redirect_logout_url}";
      }, 100);
    </script>`, {
            headers: { 'Content-Type': 'text/html' },
            status: 200,
        });
    });
}
exports.handleLogout = handleLogout;
