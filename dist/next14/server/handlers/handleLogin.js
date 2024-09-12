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
exports.handleLogin = void 0;
const server_1 = require("next/server");
const utils_1 = require("../utils");
const utils_2 = require("../utils");
const authConfig_1 = require("../../../authConfig");
function handleLogin(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //If we already have a session-cookie we should redirect to the callback URL
        const cookieName = authConfig_1.SESSION_NAME || 'session';
        if (cookieName) {
            const cookieValue = (0, utils_2.getCookie)(cookieName);
            const { access_token } = JSON.parse(cookieValue || '{}');
            if (access_token) {
                return server_1.NextResponse.redirect(`${authConfig_1.SUPRA_AUTH_CLIENT_BASE_URL}`);
            }
        }
        // Generate and sign the state, then store it in a cookie
        const state = (0, utils_1.generateRandomState)();
        (0, utils_2.setCookie)('state', state, 'lax', authConfig_1.SESSION_COOKIE_MAX_AGE);
        const redirectUrl = `${authConfig_1.SUPRA_AUTH_ISSUER_BASE_URL}/api/auth/authorize?client_id=${authConfig_1.SUPRA_AUTH_CLIENT_ID}&redirect_uri=${authConfig_1.REDIRECT_URI}&state=${state}`;
        return new server_1.NextResponse(null, {
            status: 308,
            headers: {
                'Location': redirectUrl,
                'Access-Control-Allow-Credentials': 'true',
            },
        });
    });
}
exports.handleLogin = handleLogin;
