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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCallbackNextApi = void 0;
const server_1 = require("next/server");
const authConfig_1 = require("../../../authConfig");
const cookie_1 = __importDefault(require("cookie"));
function handleCallbackNextApi(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { query } = req;
        const code = query.code;
        const state = query.state;
        const device = query.device;
        if (!code || !state || !device) {
            return res.status(400).json({ error: 'code, state and device are required' });
        }
        // const agent = req.headers['user-agent'] || 'Unknown';
        // const ip = req.headers['x-forwarded-for']  || req.headers['x-real-ip'] || 'Unknown';
        const { headers } = req;
        const agent = headers['user-agent'] || 'Unknown';
        const ip = headers['x-forwarded-for'] || headers['x-real-ip'] || 'Unknown';
        const referer = new URL(authConfig_1.SUPRA_AUTH_CLIENT_BASE_URL || '').origin;
        const client_id = authConfig_1.SUPRA_AUTH_CLIENT_ID || '';
        const client_secret = authConfig_1.SUPRA_AUTH_CLIENT_SECRET || '';
        const headersObj = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': `${referer}`,
            'User-Agent': agent || '',
            'Real-Ip': ip || '',
            'Device': device,
        };
        // const headerObj: any = {
        //   'Content-Type': 'application/x-www-form-urlencoded',
        //   'Referer': `${referer}`,
        //   'User-Agent': agent || '',
        //   'Real-Ip': ip || '',
        // };
        console.log('Trying to send this Headers in /callback: ', headersObj);
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
        console.log('Result after calling /token: ', { access_token, email, refresh_token });
        if (access_token) {
            const sessionData = JSON.stringify({ access_token, email, refresh_token });
            // const res = NextResponse.redirect(`${SUPRA_AUTH_CLIENT_BASE_URL}/`);
            // res.cookies.set({
            //   name: SESSION_NAME || 'session',
            //   value: sessionData,
            //   httpOnly: process.env.APP_ENV !== 'development',
            //   secure: process.env.APP_ENV !== 'development',
            //   sameSite: 'lax',
            //   path: '/',
            //   maxAge: 3600,
            // });
            //const cookieSession = `${SESSION_NAME || 'session'}=${sessionData}; Path=/; HttpOnly; Max-Age=${3600}; SameSite=Lax; Secure=${process.env.APP_ENV !== 'development'}`;
            //res.setHeader('Set-Cookie', cookieSession);
            //const cookieState = `state=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
            //res.setHeader('Set-Cookie', cookieState);
            const cookieSession = cookie_1.default.serialize(authConfig_1.SESSION_NAME || 'session', sessionData, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 3600,
                sameSite: 'lax',
                path: '/',
            });
            const cookieState = cookie_1.default.serialize('state', '', {
                maxAge: 0,
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
            });
            res.setHeader('Set-Cookie', [cookieSession, cookieState]);
            // const res = NextResponse.redirect(`${SUPRA_AUTH_CLIENT_BASE_URL}/`);
            res.redirect(`${authConfig_1.SUPRA_AUTH_CLIENT_BASE_URL}/`);
            return res;
        }
        console.error('Access token missing in response');
        return res.status(400).json({ error: 'Access token missing' });
    });
}
exports.handleCallbackNextApi = handleCallbackNextApi;
