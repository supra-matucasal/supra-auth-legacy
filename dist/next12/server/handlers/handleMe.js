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
exports.handleMeNextApi = void 0;
const cookie_1 = require("cookie");
const uuid_1 = require("uuid");
const authConfig_1 = require("../../../authConfig");
const getHeaders = (bearerToken, agent, ip) => ({
    'Referer': authConfig_1.SUPRA_AUTH_CLIENT_BASE_URL,
    'Authorization': `Bearer ${bearerToken}`,
    'User-Agent': agent || '',
    'Real-Ip': ip || '',
    'device': (0, uuid_1.v4)()
});
function handleMeNextApi(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { headers } = req;
        const cookies = (0, cookie_1.parse)(req.headers.cookie || '');
        let session = cookies[`${authConfig_1.SESSION_NAME}`];
        session = JSON.parse(session);
        let agent = headers['user-agent'] || 'Unknown';
        const ip = headers['x-forwarded-for'] || headers['x-real-ip'] || 'Unknown';
        // const redirectUrl = new URL(APP_URL);
        try {
            const response = yield fetch(authConfig_1.ME_URL, {
                method: 'GET',
                headers: getHeaders(session.access_token, agent, ip),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to Fetch Me');
            }
            const user = yield response.json();
            return res.status(200).json(user);
        }
        catch (error) {
            console.error("Error during Me Fetch:", error);
            return res.status(400).json({ error: "Failed to fetch user" });
        }
    });
}
exports.handleMeNextApi = handleMeNextApi;
