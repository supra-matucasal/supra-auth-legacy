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
exports.handleMe = void 0;
const server_1 = require("next/server");
const uuid_1 = require("uuid");
const authConfig_1 = require("../../../authConfig");
const getHeaders = (bearerToken, agent, ip) => ({
    'Referer': authConfig_1.SUPRA_AUTH_CLIENT_BASE_URL,
    'Authorization': `Bearer ${bearerToken}`,
    'User-Agent': agent || '',
    'Real-Ip': ip || '',
    'device': (0, uuid_1.v4)()
});
const handleMeResponse = (response) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield response.json();
    const res = server_1.NextResponse.json(user);
    return res;
});
function handleMe(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { headers } = req;
        const authorization = headers.get('Authorization');
        const bearerToken = authorization === null || authorization === void 0 ? void 0 : authorization.replace('Bearer ', '');
        let agent = headers.get('user-agent') || 'Unknown';
        const ip = headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'Unknown';
        // const redirectUrl = new URL(APP_URL);
        try {
            console.log("getHeaders(bearerToken, agent, ip)-------------------->", getHeaders(bearerToken, agent, ip));
            const response = yield fetch(authConfig_1.ME_URL, {
                method: 'GET',
                headers: getHeaders(bearerToken, agent, ip),
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Failed to Fetch Me');
            }
            return yield handleMeResponse(response);
        }
        catch (error) {
            console.error("Error during Me Fetch:", error);
            return server_1.NextResponse.json({ error: 'Failed to Fetch Me' }, { status: 500 });
        }
    });
}
exports.handleMe = handleMe;
