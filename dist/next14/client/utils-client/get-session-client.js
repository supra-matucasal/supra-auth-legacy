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
exports.getSessionClient = void 0;
const getSessionClient = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log('getSessionsClient');
    try {
        const getSessionRoute = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/session`;
        const response = yield fetch(getSessionRoute, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (response.ok) {
            const data = yield response.json();
            return {
                access_token: (_a = data === null || data === void 0 ? void 0 : data.session) === null || _a === void 0 ? void 0 : _a.access_token,
                refresh_token: (_b = data === null || data === void 0 ? void 0 : data.session) === null || _b === void 0 ? void 0 : _b.refresh_token,
            };
        }
        throw new Error('Failed to refresh tokens');
    }
    catch (error) {
        console.error('Error refreshing tokens:', error);
        return null;
    }
});
exports.getSessionClient = getSessionClient;
