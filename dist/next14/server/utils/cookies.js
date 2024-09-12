"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCookie = exports.getCookie = exports.setCookie = void 0;
const headers_1 = require("next/headers");
//const cookieDomain = process.env.SESSION_COOKIE_DOMAIN || 'localhost';
const setCookie = (cookieName, value, sameSite, cookieMaxAge = '3600') => {
    (0, headers_1.cookies)().set({
        name: cookieName,
        value: value,
        httpOnly: process.env.APP_ENV !== 'development',
        secure: process.env.APP_ENV !== 'development',
        sameSite: sameSite || 'strict',
        path: '/',
        //domain: cookieDomain,
        maxAge: +cookieMaxAge
    });
};
exports.setCookie = setCookie;
const getCookie = (cookieName) => {
    var _a;
    return ((_a = (0, headers_1.cookies)().get(cookieName)) === null || _a === void 0 ? void 0 : _a.value) || '';
};
exports.getCookie = getCookie;
const removeCookie = (cookieName) => {
    (0, headers_1.cookies)().delete(cookieName);
};
exports.removeCookie = removeCookie;
