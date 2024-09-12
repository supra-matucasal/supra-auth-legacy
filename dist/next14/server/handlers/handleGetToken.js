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
exports.handleGetToken = void 0;
const server_1 = require("next/server");
const authConfig_1 = require("../../../authConfig");
const cookie_1 = require("cookie");
function handleGetToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookies = (0, cookie_1.parse)(req.headers.cookie || '');
        let session = cookies[`${authConfig_1.SESSION_NAME}`];
        session = JSON.parse(session);
        try {
            return res.status(200).json(session);
        }
        catch (error) {
            console.error("Failed to fetch token:", error);
            return server_1.NextResponse.json({ error: 'Failed to fetch token' }, { status: 500 });
        }
    });
}
exports.handleGetToken = handleGetToken;
