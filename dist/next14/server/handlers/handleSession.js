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
exports.handleSessionNextApi = void 0;
const authConfig_1 = require("../../../authConfig");
function handleSessionNextApi(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookieValue = req.cookies[authConfig_1.SESSION_NAME || 'session'];
        if (cookieValue === '' || cookieValue === undefined) {
            // If cookieValue is an empty object, return undefined
            return undefined;
        }
        //let isTokenRefreshing: any = false; // Track token refresh status
        const { access_token, email, refresh_token } = JSON.parse(cookieValue || '');
        //return { access_token, email, refresh_token };
        return res.status(200).json({ session: { access_token, email, refresh_token } });
    });
}
exports.handleSessionNextApi = handleSessionNextApi;
