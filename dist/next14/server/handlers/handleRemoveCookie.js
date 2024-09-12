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
exports.handleRemoveCookie = void 0;
const server_1 = require("next/server");
const authConfig_1 = require("../../../authConfig");
const utils_1 = require("../utils");
function handleRemoveCookie(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookieName = authConfig_1.SESSION_NAME || 'session';
        const cookieValue = (0, utils_1.getCookie)(cookieName);
        if (!cookieValue) {
            return new server_1.NextResponse(JSON.stringify({ error: 'Failed to fetch token' }), { status: 400 });
        }
        try {
            if (cookieValue) {
                (0, utils_1.removeCookie)(cookieName);
                return new server_1.NextResponse(cookieValue, { status: 200 });
            }
            else {
                return new server_1.NextResponse(JSON.stringify({ error: 'Failed to remove token' }), { status: 400 });
            }
            // Remove the session cookie by setting its expiration to a past date
        }
        catch (error) {
            console.error("Failed to fetch token:", error);
            return server_1.NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
        }
    });
}
exports.handleRemoveCookie = handleRemoveCookie;
