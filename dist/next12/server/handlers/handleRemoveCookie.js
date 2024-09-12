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
exports.handleRemoveCookieNextApi = void 0;
const cookie_1 = require("cookie");
const authConfig_1 = require("../../../authConfig");
function handleRemoveCookieNextApi(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookies = (0, cookie_1.parse)(req.headers.cookie || '');
        let session = cookies[`${authConfig_1.SESSION_NAME}`];
        if (!session) {
            return res.status(400).json({ error: 'Session not found' });
        }
        try {
            session = JSON.parse(session);
            if (session) {
                res.setHeader('Set-Cookie', (0, cookie_1.serialize)(authConfig_1.SESSION_NAME, '', {
                    path: '/',
                    expires: new Date(0),
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax'
                }));
                return res.status(200).json(session);
            }
            else {
                return res.status(200).json({});
            }
            // Remove the session cookie by setting its expiration to a past date
        }
        catch (error) {
            console.error("Failed to fetch token:", error);
            return res.status(400).json({ error: "Failed to fetch token" });
        }
    });
}
exports.handleRemoveCookieNextApi = handleRemoveCookieNextApi;
