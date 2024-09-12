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
exports.createAuthRouter = void 0;
// src/server/auth-router.ts
const server_1 = require("next/server");
const handlers_1 = require("../handlers");
const utils_1 = require("../utils");
function createAuthRouter() {
    return function authRouter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const pathname = req.nextUrl.pathname;
            const route = pathname.split('/').pop();
            switch (req.method) {
                case 'GET':
                    switch (route) {
                        case 'login':
                            return (0, handlers_1.handleLogin)(req, res);
                        case 'callback':
                            return (0, handlers_1.handleCallback)(req, res);
                        case 'logout':
                            return (0, handlers_1.handleLogout)(req, res);
                        case 'token':
                            return (0, handlers_1.handleToken)(req, res);
                        case 'me':
                            return (0, handlers_1.handleMe)(req, res);
                        case 'remove-token':
                            return (0, handlers_1.handleRemoveCookie)(req, res);
                        case 'session':
                            return new server_1.NextResponse(JSON.stringify({ session: (0, utils_1.getSession)() }), { status: 200 });
                        default:
                            return new server_1.NextResponse(JSON.stringify({ error: 'Invalid route' }), { status: 400 });
                    }
                case 'POST':
                    switch (route) {
                        case 'refresh-token':
                            return (0, handlers_1.handleRefreshToken)(req, res);
                        default:
                            return new server_1.NextResponse(JSON.stringify({ error: 'Invalid route' }), { status: 400 });
                    }
                default:
                    return new server_1.NextResponse(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
            }
        });
    };
}
exports.createAuthRouter = createAuthRouter;
