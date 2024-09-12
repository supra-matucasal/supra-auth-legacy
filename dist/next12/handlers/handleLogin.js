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
exports.handleLoginNextApi = void 0;
const authConfig_1 = require("../../authConfig");
const cookie_1 = __importDefault(require("cookie"));
const uuid_1 = require("uuid");
function handleLoginNextApi(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //If we already have a session-cookie we should redirect to the callback URL
        const cookieName = authConfig_1.SESSION_NAME || 'session';
        if (cookieName) {
            const cookieValue = req.cookies[cookieName] || '';
            const { access_token } = JSON.parse(cookieValue || '{}');
            if (access_token) {
                return res.redirect(`${authConfig_1.SUPRA_AUTH_CLIENT_BASE_URL}`);
            }
        }
        // Generate and sign the state, then store it in a cookie
        const state = (0, uuid_1.v4)();
        //setting the cookie
        //const cookie = `state=${state}; Path=/; HttpOnly; Max-Age=${SESSION_COOKIE_MAX_AGE}; SameSite=Lax`;
        const cookieValue = cookie_1.default.serialize('state', state, {
            httpOnly: true,
            maxAge: authConfig_1.SESSION_COOKIE_MAX_AGE,
            sameSite: 'lax',
            path: '/',
        });
        res.setHeader('Set-Cookie', cookieValue);
        const redirectUrl = `${authConfig_1.SUPRA_AUTH_ISSUER_BASE_URL}/api/auth/authorize?client_id=${authConfig_1.SUPRA_AUTH_CLIENT_ID}&redirect_uri=${authConfig_1.REDIRECT_URI}&state=${state}`;
        return res.redirect(redirectUrl);
    });
}
exports.handleLoginNextApi = handleLoginNextApi;
