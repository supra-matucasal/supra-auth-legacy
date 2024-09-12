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
exports.handleTokenNextApi = void 0;
const cookie_1 = __importDefault(require("cookie"));
const authConfig_1 = require("../../../authConfig");
function handleTokenNextApi(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { headers } = req;
        const agent = headers['user-agent'] || 'Unknown';
        const ip = headers['x-forwarded-for'] || headers['x-real-ip'] || 'Unknown';
        const referer = new URL(authConfig_1.SUPRA_AUTH_CLIENT_BASE_URL || '').origin;
        const client_id = authConfig_1.SUPRA_AUTH_CLIENT_ID;
        const client_secret = authConfig_1.SUPRA_AUTH_CLIENT_SECRET;
        //const codeState = getCookie('tempCode');
        const codeState = req.cookies['tempCode'];
        if (!codeState) {
            console.error('No code stored in cookies');
            // Handle missing state (CSRF or other error)
            //return new NextResponse(JSON.stringify({ error: 'Cookie of codeState not stored' }), { status: 400 });
            return res.status(400).json({ error: 'Cookie of codeState not stored' });
        }
        //console.log('Trying to call this: ', `${process.env.SUPRA_AUTH_FRONTEND_URL}/api/auth/token?code=${code}&client_id=${client_id}&redirect_uri=${redirect_url}&client_secret=${client_secret}`)
        // const response = await fetch(`${process.env.AUTH_SSO_SERVER}/api/auth/token?code=${code}&client_id=${client_id}&redirect_uri=${redirect_url}&client_secret=${client_secret}`, {
        //   method: 'POST',
        //   headers: headers(),
        //   credentials: 'include',
        // });
        const params = new URLSearchParams();
        params.append('code', codeState);
        params.append('client_id', client_id || '');
        params.append('redirect_uri', authConfig_1.REDIRECT_URI || '');
        params.append('client_secret', client_secret || '');
        params.append('grant_type', 'authorization_code');
        const headerObj = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': `${referer}`,
            'User-Agent': agent || '',
            'Real-Ip': ip || '',
        };
        console.log('Trying to send this Headers in /token: ', headerObj);
        const response = yield fetch(authConfig_1.TOKEN_FETCH_URL, {
            method: 'POST',
            headers: headerObj,
            body: params,
            credentials: 'include',
        });
        if (response.status !== 200) {
            //return new NextResponse(JSON.stringify({ error: 'Invalid call to token in /callback' }), { status: 400 });
            return res.status(400).json({ error: 'Invalid call to token in /callback' });
        }
        const { access_token, email, refresh_token } = yield response.json();
        console.log('Result after /token: ', { access_token, email, refresh_token });
        if (access_token) {
            // const sessionData = JSON.stringify({ access_token, refresh_token });
            //const cookie = `${SESSION_NAME}=${access_token}; Path=/; HttpOnly; Max-Age=${SESSION_COOKIE_MAX_AGE}; SameSite=Lax`;
            const cookieValue = cookie_1.default.serialize(authConfig_1.SESSION_NAME || 'session', access_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: parseInt(authConfig_1.SESSION_COOKIE_MAX_AGE, 10),
                sameSite: 'lax',
                path: '/',
            });
            res.setHeader('Set-Cookie', cookieValue);
            // setCookie(SESSION_NAME, access_token, 'lax', SESSION_COOKIE_MAX_AGE);
            // const res = new NextResponse(JSON.stringify({ access_token, email, refresh_token }), { status: 200 });
            // res.cookies.set({
            //   name: SESSION_NAME || 'session',
            //   value: access_token,
            //   httpOnly: process.env.APP_ENV !== 'development',
            //   secure: process.env.APP_ENV !== 'development',
            //   sameSite: 'lax',
            //   path: '/',
            //   maxAge: SESSION_COOKIE_MAX_AGE | 3600,
            // });
            //return new NextResponse(JSON.stringify({ access_token, email, refresh_token }), { status: 200 });
            return res.status(200).json({ access_token, email, refresh_token });
        }
    });
}
exports.handleTokenNextApi = handleTokenNextApi;
