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
exports.createAuthRouterNextApi = void 0;
const handlers_1 = require("../handlers");
function createAuthRouterNextApi() {
    return function authRouter(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const pathname = req.url;
            const route = pathname ? (_a = pathname.split('/').pop()) === null || _a === void 0 ? void 0 : _a.split('?')[0] : undefined;
            console.log('route in createAuthRouterNextApi', route);
            switch (req.method) {
                case 'GET':
                    switch (route) {
                        case 'login':
                            return (0, handlers_1.handleLoginNextApi)(req, res);
                        case 'callback':
                            return (0, handlers_1.handleCallbackNextApi)(req, res);
                        case 'logout':
                            console.log('Trying to logut');
                            return (0, handlers_1.handleLogoutNextApi)(req, res);
                        case 'token':
                            return (0, handlers_1.handleTokenNextApi)(req, res);
                        case 'me':
                            return (0, handlers_1.handleMeNextApi)(req, res);
                        case 'session':
                            return (0, handlers_1.handleSessionNextApi)(req, res);
                        case 'remove-token':
                            return (0, handlers_1.handleRemoveCookieNextApi)(req, res);
                        default:
                            return res.status(400).json({ error: 'Invalid route' });
                    }
                case 'POST':
                    switch (route) {
                        case 'refresh-token':
                            return (0, handlers_1.handleRefreshTokenNextApi)(req, res);
                        default:
                            return res.status(400).json({ error: 'Invalid route' });
                    }
                default:
                    return res.status(405).json({ error: 'Method not allowed' });
            }
        });
    };
}
exports.createAuthRouterNextApi = createAuthRouterNextApi;
