"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSession = exports.generateRandomState = exports.getTempCode = exports.getSessionWithRequest = exports.getSession = void 0;
const authConfig_1 = require("../../../authConfig");
const cookies_1 = require("./cookies");
const uuid_1 = require("uuid");
const getSession = () => {
    console.log('Getting the session from getSession()...');
    const cookieValue = (0, cookies_1.getCookie)(authConfig_1.SESSION_NAME || 'session');
    if (cookieValue === '') {
        // If cookieValue is an empty object, return undefined
        return undefined;
    }
    //let isTokenRefreshing: any = false; // Track token refresh status
    const { access_token, email, refresh_token } = JSON.parse(cookieValue || '');
    console.log('Result of getting the session:', { access_token, email, refresh_token });
    return { access_token, email, refresh_token };
};
exports.getSession = getSession;
const getSessionWithRequest = (req, res) => {
    const cookieValue = req.cookies[authConfig_1.SESSION_NAME || 'session'];
    console.log('cookieValue', cookieValue);
    if (cookieValue === '' || cookieValue === undefined) {
        console.log('cookieValue is empty');
        // If cookieValue is an empty object, return undefined
        return undefined;
    }
    //let isTokenRefreshing: any = false; // Track token refresh status
    const { access_token, email, refresh_token } = JSON.parse(cookieValue || '');
    return { access_token, email, refresh_token };
    //return res.status(200).json({ session: { access_token, email, refresh_token } });
};
exports.getSessionWithRequest = getSessionWithRequest;
const getTempCode = () => {
    const cookieValue = (0, cookies_1.getCookie)(authConfig_1.SESSION_NAME);
    if (cookieValue === '') {
        // If cookieValue is an empty object, return undefined
        return undefined;
    }
    const session = cookieValue || null;
    return session;
};
exports.getTempCode = getTempCode;
const generateRandomState = () => {
    return (0, uuid_1.v4)();
};
exports.generateRandomState = generateRandomState;
const saveSession = (session) => {
    const cookieValue = JSON.stringify(session);
    (0, cookies_1.setCookie)(authConfig_1.SESSION_NAME, cookieValue, 'lax', authConfig_1.SESSION_COOKIE_MAX_AGE);
};
exports.saveSession = saveSession;
