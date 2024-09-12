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
exports.handleRefreshToken = void 0;
const server_1 = require("next/server");
const utils_1 = require("../utils");
const authConfig_1 = require("../../../authConfig");
const getHeaders = (req, bearerToken, agent, ip) => ({
    'Referer': authConfig_1.SUPRA_AUTH_CLIENT_BASE_URL,
    'Authorization': `Bearer ${bearerToken}`,
    'User-Agent': agent || '',
    'Real-Ip': ip || '',
});
const handleTokenResponse = (response) => __awaiter(void 0, void 0, void 0, function* () {
    const { access_token, refresh_token } = yield response.json();
    const sessionData = JSON.stringify({ access_token, refresh_token });
    (0, utils_1.setCookie)(authConfig_1.SESSION_NAME, sessionData, 'lax', authConfig_1.SESSION_COOKIE_MAX_AGE);
    const res = server_1.NextResponse.json({ access_token, refresh_token });
    res.cookies.set({
        name: authConfig_1.SESSION_NAME || 'session',
        value: sessionData,
        httpOnly: process.env.APP_ENV !== 'development',
        secure: process.env.APP_ENV !== 'development',
        sameSite: 'lax',
        path: '/',
        maxAge: authConfig_1.SESSION_COOKIE_MAX_AGE,
    });
    return res;
});
function handleRefreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const APP_URL = authConfig_1.SUPRA_AUTH_CLIENT_BASE_URL;
        const { headers } = req;
        const authorization = headers.get('Authorization');
        const bearerToken = authorization === null || authorization === void 0 ? void 0 : authorization.replace('Bearer ', '');
        let agent = headers.get('user-agent') || 'Unknown';
        const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'Unknown';
        const redirectUrl = new URL(APP_URL);
        try {
            const response = yield fetch(authConfig_1.REFRESH_TOKEN_URL, {
                method: 'POST',
                headers: getHeaders(req, bearerToken, agent, ip),
                body: JSON.stringify({ redirectLogoutUrl: redirectUrl }),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to refresh token');
            }
            return yield handleTokenResponse(response);
        }
        catch (error) {
            console.error("Error during token generation:", error);
            return server_1.NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 });
        }
    });
}
exports.handleRefreshToken = handleRefreshToken;
