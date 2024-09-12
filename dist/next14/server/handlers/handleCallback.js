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
exports.handleCallback = void 0;
const server_1 = require("next/server");
const utils_1 = require("../utils");
const authConfig_1 = require("../../../authConfig");
function handleCallback(req, res) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Callback route initiated...');
        const { searchParams } = req.nextUrl;
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const device = searchParams.get('device');
        if (!code || !state || !device) {
            return new server_1.NextResponse(JSON.stringify({ error: 'code, state and device are required' }), { status: 400 });
        }
        //TODO: Fix state verification
        // const cookieState = getCookie('state');
        // if (!cookieState) {
        //   console.error('No state stored in cookies');
        //   return new NextResponse(JSON.stringify({ error: 'State not stored in cookies' }), { status: 400 });
        // }
        // if (!verifyState(cookieState) || !cookieState.startsWith(state)) {
        //   console.error('Invalid state');
        //   return new NextResponse(JSON.stringify({ error: 'Invalid state' }), { status: 400 });
        // }
        const { headers } = req;
        const agent = (_a = headers.get('user-agent')) !== null && _a !== void 0 ? _a : 'Unknown';
        const ip = (_c = (_b = headers.get('x-forwarded-for')) !== null && _b !== void 0 ? _b : headers.get('x-real-ip')) !== null && _c !== void 0 ? _c : 'Unknown';
        const referer = new URL(authConfig_1.SUPRA_AUTH_CLIENT_BASE_URL || '').origin;
        const client_id = authConfig_1.SUPRA_AUTH_CLIENT_ID || '';
        const client_secret = authConfig_1.SUPRA_AUTH_CLIENT_SECRET || '';
        const headersObj = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': `${referer}`,
            'User-Agent': agent,
            'Real-Ip': ip,
            'Device': device,
        };
        console.log('Trying to send this Headers: ', headersObj);
        const params = new URLSearchParams({
            code,
            client_id,
            redirect_uri: authConfig_1.REDIRECT_URI,
            client_secret,
            grant_type: 'authorization_code',
        });
        const response = yield fetch(authConfig_1.TOKEN_FETCH_URL, {
            method: 'POST',
            headers: headersObj,
            body: params,
            credentials: 'include',
        });
        if (response.status !== 200) {
            console.error('Failed to fetch token');
            return new server_1.NextResponse(JSON.stringify({ error: 'Failed to fetch token' }), { status: 400 });
        }
        const { access_token, email, refresh_token } = yield response.json();
        if (access_token) {
            const sessionData = JSON.stringify({ access_token, email, refresh_token });
            const res = server_1.NextResponse.redirect(`${authConfig_1.SUPRA_AUTH_CLIENT_BASE_URL}/`);
            res.cookies.set({
                name: authConfig_1.SESSION_NAME || 'session',
                value: sessionData,
                httpOnly: process.env.APP_ENV !== 'development',
                secure: process.env.APP_ENV !== 'development',
                sameSite: 'lax',
                path: '/',
                maxAge: 3600,
            });
            (0, utils_1.removeCookie)('state');
            return res;
        }
        console.error('Access token missing in response');
        return new server_1.NextResponse(JSON.stringify({ error: 'Access token missing' }), { status: 400 });
    });
}
exports.handleCallback = handleCallback;
